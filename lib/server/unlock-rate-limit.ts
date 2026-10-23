/// <reference types="node" />

import type { VercelRequest } from "@vercel/node";
import { getSupabaseAdminClient } from "./supabase.js";

const TABLE = "unlock_attempts";
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptRow = {
  key: string;
  fail_count: number;
  locked_until: string | null;
  updated_at: string;
};

export type UnlockRateLimitState = {
  blocked: boolean;
  retryAfterSec: number;
};

function ipKey(ip: string): string {
  return `ip:${ip}`;
}

function headerValue(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = headerValue(req.headers["x-forwarded-for"]);
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headerValue(req.headers["x-real-ip"])?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function retryAfterSecFromLockedUntil(lockedUntil: string): number {
  const ms = Date.parse(lockedUntil) - Date.now();
  return Math.max(1, Math.ceil(ms / 1000));
}

export async function getUnlockRateLimitState(
  ip: string,
): Promise<UnlockRateLimitState> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { blocked: false, retryAfterSec: 0 };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("key, fail_count, locked_until, updated_at")
      .eq("key", ipKey(ip))
      .maybeSingle();

    if (error) {
      console.warn("[unlock-rate-limit] read failed:", error.message);
      return { blocked: false, retryAfterSec: 0 };
    }

    const row = data as AttemptRow | null;
    if (!row?.locked_until) {
      return { blocked: false, retryAfterSec: 0 };
    }

    const lockedUntilMs = Date.parse(row.locked_until);
    if (Number.isNaN(lockedUntilMs) || lockedUntilMs <= Date.now()) {
      return { blocked: false, retryAfterSec: 0 };
    }

    return {
      blocked: true,
      retryAfterSec: retryAfterSecFromLockedUntil(row.locked_until),
    };
  } catch (error) {
    console.warn("[unlock-rate-limit] read threw:", error);
    return { blocked: false, retryAfterSec: 0 };
  }
}

/**
 * Record a failed unlock. Returns retryAfterSec when this failure triggers lockout.
 */
export async function recordUnlockFailure(
  ip: string,
): Promise<{ retryAfterSec: number }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { retryAfterSec: 0 };
  }

  const key = ipKey(ip);
  const now = new Date();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("key, fail_count, locked_until, updated_at")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.warn("[unlock-rate-limit] read before fail failed:", error.message);
      return { retryAfterSec: 0 };
    }

    const row = data as AttemptRow | null;
    let failCount = 0;

    if (row) {
      const lockedUntilMs = row.locked_until
        ? Date.parse(row.locked_until)
        : NaN;
      if (!Number.isNaN(lockedUntilMs) && lockedUntilMs > Date.now()) {
        return {
          retryAfterSec: retryAfterSecFromLockedUntil(row.locked_until!),
        };
      }
      failCount = typeof row.fail_count === "number" ? row.fail_count : 0;
    }

    const nextCount = failCount + 1;
    const shouldLock = nextCount >= MAX_FAILURES;
    const lockedUntil = shouldLock
      ? new Date(now.getTime() + LOCKOUT_MS).toISOString()
      : null;
    const storedFailCount = shouldLock ? 0 : nextCount;

    const { error: upsertError } = await supabase.from(TABLE).upsert(
      {
        key,
        fail_count: storedFailCount,
        locked_until: lockedUntil,
        updated_at: now.toISOString(),
      },
      { onConflict: "key" },
    );

    if (upsertError) {
      console.warn("[unlock-rate-limit] upsert failed:", upsertError.message);
      return { retryAfterSec: 0 };
    }

    if (shouldLock && lockedUntil) {
      return { retryAfterSec: retryAfterSecFromLockedUntil(lockedUntil) };
    }

    return { retryAfterSec: 0 };
  } catch (error) {
    console.warn("[unlock-rate-limit] record failure threw:", error);
    return { retryAfterSec: 0 };
  }
}

export async function clearUnlockFailures(ip: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from(TABLE).delete().eq("key", ipKey(ip));
    if (error) {
      console.warn("[unlock-rate-limit] clear failed:", error.message);
    }
  } catch (error) {
    console.warn("[unlock-rate-limit] clear threw:", error);
  }
}

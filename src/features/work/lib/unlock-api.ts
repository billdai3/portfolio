import { clearAllCachedWorkContent } from "./locked-content-cache";
import type { SafeMdxDocument } from "./safe-mdx-types";

export type WorkContentPayload = {
  slug: string;
  frontmatter: Record<string, unknown>;
  document: SafeMdxDocument;
};

export type LockedContentResult = WorkContentPayload | "unauthorized" | "error";

export type UnlockRateLimited = {
  kind: "rate-limited";
  retryAfterSec: number;
};

export type UnlockContentResult =
  | WorkContentPayload
  | "unauthorized"
  | "error"
  | "unlocked-no-content"
  | UnlockRateLimited;

function parseRetryAfterSec(res: Response, body: unknown): number {
  if (body && typeof body === "object") {
    const candidate = (body as { retryAfterSec?: unknown }).retryAfterSec;
    if (typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0) {
      return Math.ceil(candidate);
    }
  }

  const header = res.headers.get("Retry-After");
  if (header) {
    const seconds = Number.parseInt(header, 10);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
  }

  return 15 * 60;
}

const UNLOCK_HINT_KEY = "work:unlocked";

const unlockHintListeners = new Set<() => void>();

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function notifyUnlockHint(): void {
  for (const listener of unlockHintListeners) {
    listener();
  }
}

export function subscribeUnlockHint(listener: () => void): () => void {
  unlockHintListeners.add(listener);
  return () => {
    unlockHintListeners.delete(listener);
  };
}

export function hasUnlockHint(): boolean {
  if (!canUseSessionStorage()) return false;
  return window.sessionStorage.getItem(UNLOCK_HINT_KEY) === "1";
}

export function persistUnlockHint(): void {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(UNLOCK_HINT_KEY, "1");
  notifyUnlockHint();
}

export function clearUnlockHint(): void {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(UNLOCK_HINT_KEY);
  notifyUnlockHint();
}

export async function lockWorkContent(): Promise<boolean> {
  try {
    const res = await fetch("/api/work-unlock", {
      method: "DELETE",
      credentials: "same-origin",
    });

    clearUnlockHint();
    clearAllCachedWorkContent();
    return res.ok;
  } catch {
    clearUnlockHint();
    clearAllCachedWorkContent();
    return false;
  }
}

function isSafeMdxDocument(value: unknown): value is SafeMdxDocument {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { type?: unknown; children?: unknown };
  return candidate.type === "root" && Array.isArray(candidate.children);
}

function toWorkContentPayload(data: unknown): WorkContentPayload | null {
  if (!data || typeof data !== "object") return null;

  const candidate = data as {
    slug?: unknown;
    document?: unknown;
    frontmatter?: unknown;
    body?: unknown;
  };

  if (typeof candidate.slug !== "string") return null;
  if (!isSafeMdxDocument(candidate.document)) return null;

  return {
    slug: candidate.slug,
    document: candidate.document,
    frontmatter:
      candidate.frontmatter && typeof candidate.frontmatter === "object"
        ? (candidate.frontmatter as Record<string, unknown>)
        : {},
  };
}

export async function fetchLockedContent(
  slug: string,
  signal?: AbortSignal,
): Promise<LockedContentResult> {
  const res = await fetch(
    `/api/work-content?slug=${encodeURIComponent(slug)}`,
    { credentials: "same-origin", signal },
  );

  if (res.status === 401) return "unauthorized";
  if (!res.ok) return "error";

  const payload = toWorkContentPayload(await res.json());
  return payload ?? "error";
}

export async function unlockAndFetchContent(
  slug: string,
  password: string,
  signal?: AbortSignal,
): Promise<UnlockContentResult> {
  const res = await fetch("/api/work-unlock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ password, slug }),
    signal,
  });

  if (res.status === 401) return "unauthorized";

  if (res.status === 429) {
    const body = await res.json().catch(() => null);
    return {
      kind: "rate-limited",
      retryAfterSec: parseRetryAfterSec(res, body),
    };
  }

  if (!res.ok) return "error";

  const data = (await res.json()) as {
    slug?: unknown;
    document?: unknown;
    frontmatter?: unknown;
    contentError?: unknown;
  };
  const payload = toWorkContentPayload(data);
  if (payload) return payload;
  if (typeof data.contentError === "string") return "unlocked-no-content";
  return "error";
}

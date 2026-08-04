import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const SESSION_COOKIE = "work_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

type SessionPayload = {
  unlocked: true;
  exp: number;
};

function getSessionSecret(): string | undefined {
  return process.env.WORK_SESSION_SECRET;
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function createSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    unlocked: true,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = sign(payloadB64, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.unlocked !== true) return false;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function readSessionCookie(req: VercelRequest): string | undefined {
  return parseCookies(req.headers.cookie)?.[SESSION_COOKIE];
}

export function isUnlocked(req: VercelRequest): boolean {
  return verifySessionToken(readSessionCookie(req));
}

function shouldUseSecureCookies(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  const secure = shouldUseSecureCookies() ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`,
  );
}

export function clearSessionCookie(res: VercelResponse): void {
  const secure = shouldUseSecureCookies() ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  );
}

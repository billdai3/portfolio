import { timingSafeEqual } from "node:crypto";

export function passwordsMatch(
  provided: string,
  expected: string | undefined,
): boolean {
  if (!expected) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }

  return timingSafeEqual(a, b);
}

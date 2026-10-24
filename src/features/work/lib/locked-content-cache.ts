import type { WorkContentPayload } from "./unlock-api";

const contentCache = new Map<string, WorkContentPayload>();

export function getCachedWorkContent(
  slug: string,
): WorkContentPayload | undefined {
  return contentCache.get(slug);
}

export function setCachedWorkContent(
  slug: string,
  content: WorkContentPayload,
): void {
  contentCache.set(slug, content);
}

export function clearCachedWorkContent(slug: string): void {
  contentCache.delete(slug);
}

export function clearAllCachedWorkContent(): void {
  contentCache.clear();
}

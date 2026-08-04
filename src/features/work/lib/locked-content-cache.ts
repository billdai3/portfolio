import type { ComponentType, ReactNode } from "react";

type CachedWorkContent = ComponentType<{ children?: ReactNode }>;

const contentCache = new Map<string, CachedWorkContent>();

export function getCachedWorkContent(slug: string): CachedWorkContent | undefined {
  return contentCache.get(slug);
}

export function setCachedWorkContent(
  slug: string,
  content: CachedWorkContent,
): void {
  contentCache.set(slug, content);
}

export function clearCachedWorkContent(slug: string): void {
  contentCache.delete(slug);
}

export function clearAllCachedWorkContent(): void {
  contentCache.clear();
}

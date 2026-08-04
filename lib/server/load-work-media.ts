import { fetchRepoBinary, isValidAssetPath } from "./github";

type LoadedWorkMedia = {
  body: ArrayBuffer;
  contentType: string;
};

export type LoadWorkMediaResult =
  | { ok: true; file: LoadedWorkMedia }
  | { ok: false; reason: "invalid-path" | "not-found" };

type CacheEntry = {
  expiresAt: number;
  file: LoadedWorkMedia;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const mediaCache = new Map<string, CacheEntry>();

export async function loadWorkMedia(
  path: string,
): Promise<LoadWorkMediaResult> {
  if (!isValidAssetPath(path)) {
    return { ok: false, reason: "invalid-path" };
  }

  const cached = mediaCache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    return { ok: true, file: cached.file };
  }

  if (cached) {
    mediaCache.delete(path);
  }

  const file = await fetchRepoBinary(path);
  if (!file) {
    return { ok: false, reason: "not-found" };
  }

  mediaCache.set(path, {
    file,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return { ok: true, file };
}

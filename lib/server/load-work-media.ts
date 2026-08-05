import { createHash } from "node:crypto";
import { fetchRepoBinary, isValidAssetPath } from "./github";

type LoadedWorkMedia = {
  body: ArrayBuffer;
  contentType: string;
  etag: string;
};

export type LoadWorkMediaResult =
  | { ok: true; file: LoadedWorkMedia }
  | { ok: false; reason: "invalid-path" | "not-found" };

export type LoadWorkMediaMeta = {
  cache: "hit" | "miss";
};

type CacheEntry = {
  expiresAt: number;
  file: LoadedWorkMedia;
};

const CACHE_TTL_MS = 30 * 60 * 1000;
const mediaCache = new Map<string, CacheEntry>();
const inFlightLoads = new Map<string, Promise<LoadWorkMediaResult>>();

export function computeMediaEtag(body: ArrayBuffer): string {
  const digest = createHash("sha256")
    .update(Buffer.from(body))
    .digest("hex")
    .slice(0, 16);
  return `"${digest}"`;
}

export function etagMatches(
  ifNoneMatch: string | string[] | undefined,
  etag: string,
): boolean {
  if (ifNoneMatch == null) return false;

  const header = Array.isArray(ifNoneMatch)
    ? ifNoneMatch.join(",")
    : ifNoneMatch;
  const trimmed = header.trim();
  if (!trimmed) return false;
  if (trimmed === "*") return true;

  const normalize = (value: string) => value.trim().replace(/^W\//, "");
  const target = normalize(etag);

  return trimmed.split(",").some((part) => normalize(part) === target);
}

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

  const inFlight = inFlightLoads.get(path);
  if (inFlight) {
    return inFlight;
  }

  const loadPromise = (async (): Promise<LoadWorkMediaResult> => {
    const file = await fetchRepoBinary(path);
    if (!file) {
      return { ok: false, reason: "not-found" };
    }

    const loaded: LoadedWorkMedia = {
      ...file,
      etag: computeMediaEtag(file.body),
    };

    mediaCache.set(path, {
      file: loaded,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return { ok: true, file: loaded };
  })();

  inFlightLoads.set(path, loadPromise);

  try {
    return await loadPromise;
  } finally {
    inFlightLoads.delete(path);
  }
}

export function getWorkMediaMeta(path: string): LoadWorkMediaMeta {
  const cached = mediaCache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    return { cache: "hit" };
  }

  return { cache: "miss" };
}

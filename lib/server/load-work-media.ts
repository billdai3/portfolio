import { createHash } from "node:crypto";
import { isValidAssetPath } from "./github";
import { getSupabaseAdminClient } from "./supabase";

type LoadedWorkMedia = {
  body: ArrayBuffer;
  contentType: string;
  etag: string;
};

export type LoadWorkMediaResult =
  | { ok: true; file: LoadedWorkMedia }
  | {
      ok: false;
      reason: "invalid-path" | "not-found" | "misconfigured" | "download-failed";
    };

export type LoadWorkMediaMeta = {
  cache: "hit" | "miss";
};

type CacheEntry = {
  expiresAt: number;
  file: LoadedWorkMedia;
};

const CACHE_TTL_MS = 30 * 60 * 1000;
export const WORK_MEDIA_BUCKET = "portfolio-assets";
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

export function toSupabaseObjectKey(path: string): string | null {
  if (!isValidAssetPath(path)) {
    return null;
  }

  return path.replace(/^assets\//, "");
}

function guessContentType(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

export async function loadWorkMedia(
  path: string,
): Promise<LoadWorkMediaResult> {
  const objectKey = toSupabaseObjectKey(path);
  if (!objectKey) {
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
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return { ok: false, reason: "misconfigured" };
    }

    const { data, error } = await supabase.storage
      .from(WORK_MEDIA_BUCKET)
      .download(objectKey);

    if (error) {
      if (error.status === 404) {
        return { ok: false, reason: "not-found" };
      }

      return { ok: false, reason: "download-failed" };
    }

    if (!data) {
      return { ok: false, reason: "not-found" };
    }

    const body = await data.arrayBuffer();

    const loaded: LoadedWorkMedia = {
      body,
      contentType: data.type || guessContentType(objectKey),
      etag: computeMediaEtag(body),
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

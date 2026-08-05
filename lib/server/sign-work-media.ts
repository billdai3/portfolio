import { toSupabaseObjectKey, WORK_MEDIA_BUCKET } from "./load-work-media";
import { getSupabaseAdminClient } from "./supabase";

/** Signed URL lifetime; keep longer than work-content cache TTL (5 min). */
export const SIGNED_MEDIA_URL_EXPIRES_IN = 3600;

export async function createSignedMediaUrl(
  assetPath: string,
): Promise<string | null> {
  const objectKey = toSupabaseObjectKey(assetPath);
  if (!objectKey) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(WORK_MEDIA_BUCKET)
    .createSignedUrl(objectKey, SIGNED_MEDIA_URL_EXPIRES_IN);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

export async function createSignedMediaUrlMap(
  paths: string[],
): Promise<Map<string, string>> {
  const uniquePaths = [...new Set(paths)];
  const entries = await Promise.all(
    uniquePaths.map(async (path) => {
      const signedUrl = await createSignedMediaUrl(path);
      return [path, signedUrl] as const;
    }),
  );

  const map = new Map<string, string>();
  for (const [path, signedUrl] of entries) {
    if (signedUrl) {
      map.set(path, signedUrl);
    }
  }
  return map;
}

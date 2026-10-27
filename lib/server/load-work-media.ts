import { isValidAssetPath } from "./github.js";

export const WORK_MEDIA_BUCKET = "portfolio-assets";

export function toSupabaseObjectKey(path: string): string | null {
  if (!isValidAssetPath(path)) {
    return null;
  }

  return path.replace(/^assets\//, "");
}

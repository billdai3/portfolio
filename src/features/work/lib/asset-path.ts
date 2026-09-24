/** Normalize a relative or assets/ path into a repo asset path. */
export function toAssetPath(raw: string): string | null {
  let path = raw.trim();
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return null;
  }
  if (path.startsWith("/api/work-media")) return null;

  path = path.replace(/^\.\//, "").replace(/^\/+/, "");

  if (path.startsWith("assets/")) return path;
  return null;
}

const MEDIA_PROXY = "/api/work-media";

/** Normalize a relative or assets/ path into a repo asset path. */
function toAssetPath(raw: string): string | null {
  let path = raw.trim();
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return null;
  }
  if (path.startsWith("/api/work-media")) return null;

  path = path.replace(/^\.\//, "").replace(/^\/+/, "");

  if (path.startsWith("assets/")) return path;
  return null;
}

function toProxyUrl(assetPath: string): string {
  return `${MEDIA_PROXY}?path=${encodeURIComponent(assetPath)}`;
}

/**
 * Rewrite relative asset paths in MDX body to authenticated media proxy URLs.
 * Handles JSX `src="..."` / `src='...'` and markdown images `![alt](...)`.
 */
export function rewriteMediaPaths(body: string): string {
  let out = body;

  out = out.replace(
    /\bsrc=(["'])([^"']+)\1/g,
    (full, quote: string, src: string) => {
      const asset = toAssetPath(src);
      if (!asset) return full;
      return `src=${quote}${toProxyUrl(asset)}${quote}`;
    },
  );

  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (full, alt: string, src: string) => {
      const asset = toAssetPath(src);
      if (!asset) return full;
      return `![${alt}](${toProxyUrl(asset)})`;
    },
  );

  return out;
}

const IMPORT_EXPORT_RE = /^\s*(import|export)\s/m;

export function containsImportOrExport(body: string): boolean {
  return IMPORT_EXPORT_RE.test(body);
}

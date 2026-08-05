import { createSignedMediaUrlMap } from "./sign-work-media";

const MEDIA_PROXY = "/api/work-media";

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

function toProxyUrl(assetPath: string): string {
  return `${MEDIA_PROXY}?path=${encodeURIComponent(assetPath)}`;
}

function collectAssetPaths(body: string): string[] {
  const paths: string[] = [];

  for (const match of body.matchAll(/\bsrc=(["'])([^"']+)\1/g)) {
    const asset = toAssetPath(match[2] ?? "");
    if (asset) paths.push(asset);
  }

  for (const match of body.matchAll(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
  )) {
    const asset = toAssetPath(match[2] ?? "");
    if (asset) paths.push(asset);
  }

  return paths;
}

function resolveMediaUrl(
  assetPath: string,
  signedUrls: Map<string, string>,
): string {
  return signedUrls.get(assetPath) ?? toProxyUrl(assetPath);
}

/**
 * Rewrite relative asset paths in MDX body to Supabase signed URLs.
 * Falls back to authenticated `/api/work-media` proxy per asset if signing fails.
 * Handles JSX `src="..."` / `src='...'` and markdown images `![alt](...)`.
 */
export async function rewriteMediaPathsWithSignedUrls(
  body: string,
): Promise<string> {
  const assetPaths = collectAssetPaths(body);
  const signedUrls =
    assetPaths.length > 0
      ? await createSignedMediaUrlMap(assetPaths)
      : new Map<string, string>();

  let out = body;

  out = out.replace(
    /\bsrc=(["'])([^"']+)\1/g,
    (full, quote: string, src: string) => {
      const asset = toAssetPath(src);
      if (!asset) return full;
      return `src=${quote}${resolveMediaUrl(asset, signedUrls)}${quote}`;
    },
  );

  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (full, alt: string, src: string) => {
      const asset = toAssetPath(src);
      if (!asset) return full;
      return `![${alt}](${resolveMediaUrl(asset, signedUrls)})`;
    },
  );

  return out;
}

const IMPORT_EXPORT_RE = /^\s*(import|export)\s/m;

export function containsImportOrExport(body: string): boolean {
  return IMPORT_EXPORT_RE.test(body);
}

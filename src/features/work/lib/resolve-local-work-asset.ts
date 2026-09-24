import { toAssetPath } from "./asset-path";

const modules = import.meta.glob<string>(
  "../../../content/work/assets/**/*",
  { eager: true, query: "?url", import: "default" },
);

function assetKeyFromGlobPath(globPath: string): string | null {
  const marker = "/content/work/assets/";
  const idx = globPath.lastIndexOf(marker);
  if (idx === -1) return null;
  return `assets/${globPath.slice(idx + marker.length)}`;
}

const urlByAssetPath = new Map<string, string>();

for (const [globPath, url] of Object.entries(modules)) {
  const key = assetKeyFromGlobPath(globPath);
  if (key) urlByAssetPath.set(key, url);
}

/**
 * Resolve `./assets/...` strings to Vite-bundled URLs for local (public) Work MDX.
 * Non-asset paths (http(s), hashed URLs, Vite import results) pass through unchanged.
 */
export function resolveLocalWorkAsset(raw: string): string {
  const asset = toAssetPath(raw);
  if (!asset) return raw;

  const url = urlByAssetPath.get(asset);
  if (url) return url;

  if (import.meta.env.DEV) {
    console.warn(
      `[work] Local asset not found in content/work/assets: "${asset}"`,
    );
  }

  return raw;
}

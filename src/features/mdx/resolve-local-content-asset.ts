import { toAssetPath } from "@/features/work/lib/asset-path";

const workModules = import.meta.glob<string>(
  "../../content/work/assets/**/*",
  { eager: true, query: "?url", import: "default" },
);

const labModules = import.meta.glob<string>(
  "../../content/lab/assets/**/*",
  { eager: true, query: "?url", import: "default" },
);

function assetKeyFromGlobPath(globPath: string): string | null {
  const workMarker = "/content/work/assets/";
  const labMarker = "/content/lab/assets/";

  const workIdx = globPath.lastIndexOf(workMarker);
  if (workIdx !== -1) {
    return `assets/${globPath.slice(workIdx + workMarker.length)}`;
  }

  const labIdx = globPath.lastIndexOf(labMarker);
  if (labIdx !== -1) {
    return `assets/${globPath.slice(labIdx + labMarker.length)}`;
  }

  return null;
}

const urlByAssetPath = new Map<string, string>();

for (const [globPath, url] of Object.entries({
  ...workModules,
  ...labModules,
})) {
  const key = assetKeyFromGlobPath(globPath);
  if (key) urlByAssetPath.set(key, url);
}

/**
 * Resolve `./assets/...` strings to Vite-bundled URLs for local Work / Lab MDX.
 * Non-asset paths (http(s), hashed URLs, Vite import results) pass through unchanged.
 */
export function resolveLocalContentAsset(raw: string): string {
  const asset = toAssetPath(raw);
  if (!asset) return raw;

  const url = urlByAssetPath.get(asset);
  if (url) return url;

  if (import.meta.env.DEV) {
    console.warn(
      `[mdx] Local asset not found in content/{work,lab}/assets: "${asset}"`,
    );
  }

  return raw;
}

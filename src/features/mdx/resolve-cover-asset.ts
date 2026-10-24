import { toAssetPath } from "@/features/work/lib/asset-path";

/** List-card covers only — keeps body gallery assets out of the Home/list graph. */
const coverModules = import.meta.glob<string>(
  [
    "../../content/work/assets/*/cover.webp",
    "../../content/work/assets/*/cover.jpg",
    "../../content/work/assets/*/cover.jpeg",
    "../../content/work/assets/*/cover.png",
    "../../content/work/assets/*/cover-hover.mp4",
    "../../content/work/assets/*/cover-hover.webm",
    "../../content/lab/assets/*/cover.webp",
    "../../content/lab/assets/*/cover.jpg",
    "../../content/lab/assets/*/cover.jpeg",
    "../../content/lab/assets/*/cover.png",
    "../../content/lab/assets/*/cover-hover.mp4",
    "../../content/lab/assets/*/cover-hover.webm",
  ],
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

for (const [globPath, url] of Object.entries(coverModules)) {
  const key = assetKeyFromGlobPath(globPath);
  if (key) urlByAssetPath.set(key, url);
}

/**
 * Resolve list-card `./assets/.../cover*` paths to Vite-bundled URLs.
 * Body Media should keep using `resolveLocalContentAsset`.
 */
export function resolveCoverAsset(raw: string): string {
  const asset = toAssetPath(raw);
  if (!asset) return raw;

  const url = urlByAssetPath.get(asset);
  if (url) return url;

  if (import.meta.env.DEV) {
    console.warn(
      `[mdx] Cover asset not found in content/{work,lab}/assets: "${asset}"`,
    );
  }

  return raw;
}

export function resolveOptionalCoverAsset(
  raw: string | undefined,
): string | undefined {
  if (!raw) return undefined;
  return resolveCoverAsset(raw);
}

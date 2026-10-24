import { toAssetPath } from "../../src/features/work/lib/asset-path.js";
import {
  SAFE_MDX_MEDIA_PROP_KEYS,
  type SafeMdxDocument,
  type SafeMdxNode,
  type SafeMdxPropValue,
} from "../../src/features/work/lib/safe-mdx-types.js";
import { createSignedMediaUrlMap } from "./sign-work-media.js";

export { toAssetPath };

const MEDIA_PROXY = "/api/work-media";

function toProxyUrl(assetPath: string): string {
  return `${MEDIA_PROXY}?path=${encodeURIComponent(assetPath)}`;
}

function isMediaPropKey(
  key: string,
): key is (typeof SAFE_MDX_MEDIA_PROP_KEYS)[number] {
  return (SAFE_MDX_MEDIA_PROP_KEYS as readonly string[]).includes(key);
}

function collectAssetPathsFromNode(node: SafeMdxNode, paths: string[]): void {
  if (node.type === "text") return;

  for (const [key, value] of Object.entries(node.props)) {
    if (!isMediaPropKey(key) || typeof value !== "string") continue;
    const asset = toAssetPath(value);
    if (asset) paths.push(asset);
  }

  for (const child of node.children) {
    collectAssetPathsFromNode(child, paths);
  }
}

function collectAssetPathsFromDocument(document: SafeMdxDocument): string[] {
  const paths: string[] = [];
  for (const child of document.children) {
    collectAssetPathsFromNode(child, paths);
  }
  return paths;
}

function resolveMediaUrl(
  assetPath: string,
  signedUrls: Map<string, string>,
): string {
  return signedUrls.get(assetPath) ?? toProxyUrl(assetPath);
}

function rewritePropValue(
  key: string,
  value: SafeMdxPropValue,
  signedUrls: Map<string, string>,
): SafeMdxPropValue {
  if (!isMediaPropKey(key) || typeof value !== "string") return value;
  const asset = toAssetPath(value);
  if (!asset) return value;
  return resolveMediaUrl(asset, signedUrls);
}

function rewriteNode(
  node: SafeMdxNode,
  signedUrls: Map<string, string>,
): SafeMdxNode {
  if (node.type === "text") return node;

  const props: Record<string, SafeMdxPropValue> = {};
  for (const [key, value] of Object.entries(node.props)) {
    props[key] = rewritePropValue(key, value, signedUrls);
  }

  return {
    ...node,
    props,
    children: node.children.map((child) => rewriteNode(child, signedUrls)),
  };
}

/** Deep-clone a safe document with media props rewritten to signed / proxy URLs. */
export async function rewriteDocumentMediaPaths(
  document: SafeMdxDocument,
): Promise<SafeMdxDocument> {
  const assetPaths = collectAssetPathsFromDocument(document);
  const signedUrls =
    assetPaths.length > 0
      ? await createSignedMediaUrlMap(assetPaths)
      : new Map<string, string>();

  return {
    type: "root",
    children: document.children.map((child) => rewriteNode(child, signedUrls)),
  };
}

const IMPORT_EXPORT_RE = /^\s*(import|export)\s/m;

export function containsImportOrExport(body: string): boolean {
  return IMPORT_EXPORT_RE.test(body);
}

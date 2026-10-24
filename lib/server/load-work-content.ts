import type { SafeMdxDocument } from "../../src/features/work/lib/safe-mdx-types.js";
import { isValidSlug } from "./github.js";
import { readPrebuiltWork } from "./load-prebuilt-work.js";
import { rewriteDocumentMediaPaths } from "./rewrite-media.js";

export type LoadedWorkContent = {
  slug: string;
  frontmatter: Record<string, unknown>;
  document: SafeMdxDocument;
};

export type LoadWorkContentResult =
  | { ok: true; content: LoadedWorkContent }
  | { ok: false; reason: "invalid-slug" | "not-found" | "invalid-content" };

export type LoadWorkContentMeta = {
  cache: "hit" | "miss";
};

type CacheEntry = {
  expiresAt: number;
  /** Pre-rewrite document from disk (media paths still relative). */
  entry: {
    slug: string;
    frontmatter: Record<string, unknown>;
    document: SafeMdxDocument;
  };
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const contentCache = new Map<string, CacheEntry>();

export async function loadWorkContent(
  slug: string,
): Promise<LoadWorkContentResult> {
  if (!isValidSlug(slug)) {
    return { ok: false, reason: "invalid-slug" };
  }

  let base = contentCache.get(slug);
  if (base && base.expiresAt <= Date.now()) {
    contentCache.delete(slug);
    base = undefined;
  }

  if (!base) {
    const prebuilt = readPrebuiltWork(slug);
    if (!prebuilt) {
      return { ok: false, reason: "not-found" };
    }

    base = {
      entry: {
        slug: prebuilt.slug,
        frontmatter: prebuilt.frontmatter,
        document: prebuilt.document,
      },
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    contentCache.set(slug, base);
  }

  try {
    const document = await rewriteDocumentMediaPaths(base.entry.document);
    return {
      ok: true,
      content: {
        slug: base.entry.slug,
        frontmatter: base.entry.frontmatter,
        document,
      },
    };
  } catch {
    return { ok: false, reason: "invalid-content" };
  }
}

export function getWorkContentMeta(slug: string): LoadWorkContentMeta {
  const cached = contentCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return { cache: "hit" };
  }

  return { cache: "miss" };
}

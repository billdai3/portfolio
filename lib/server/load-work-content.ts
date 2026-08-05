import matter from "gray-matter";
import { fetchRepoText, isValidSlug, mdxPathForSlug } from "./github";
import {
  containsImportOrExport,
  rewriteMediaPathsWithSignedUrls,
} from "./rewrite-media";

export type LoadedWorkContent = {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
};

export type LoadWorkContentResult =
  | { ok: true; content: LoadedWorkContent }
  | { ok: false; reason: "invalid-slug" | "not-found" | "invalid-content" };

export type LoadWorkContentMeta = {
  cache: "hit" | "miss";
};

type CacheEntry = {
  expiresAt: number;
  content: LoadedWorkContent;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const contentCache = new Map<string, CacheEntry>();
const inFlightLoads = new Map<string, Promise<LoadWorkContentResult>>();

export async function loadWorkContent(
  slug: string,
): Promise<LoadWorkContentResult> {
  if (!isValidSlug(slug)) {
    return { ok: false, reason: "invalid-slug" };
  }

  const cached = contentCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return { ok: true, content: cached.content };
  }

  if (cached) {
    contentCache.delete(slug);
  }

  const inFlight = inFlightLoads.get(slug);
  if (inFlight) {
    return inFlight;
  }

  const loadPromise = (async (): Promise<LoadWorkContentResult> => {
    const raw = await fetchRepoText(mdxPathForSlug(slug));
    if (raw === null) {
      return { ok: false, reason: "not-found" };
    }

    if (containsImportOrExport(raw)) {
      return { ok: false, reason: "invalid-content" };
    }

    const { data: frontmatter, content } = matter(raw);
    const loadedContent: LoadedWorkContent = {
      slug,
      frontmatter: frontmatter as Record<string, unknown>,
      body: await rewriteMediaPathsWithSignedUrls(content),
    };

    contentCache.set(slug, {
      content: loadedContent,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return { ok: true, content: loadedContent };
  })();

  inFlightLoads.set(slug, loadPromise);

  try {
    return await loadPromise;
  } finally {
    inFlightLoads.delete(slug);
  }
}

export function getWorkContentMeta(slug: string): LoadWorkContentMeta {
  const cached = contentCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return { cache: "hit" };
  }

  return { cache: "miss" };
}

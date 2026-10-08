import type { ComponentType, ReactNode } from "react";

export type MdxContentMetadataBase = {
  cover?: string;
  coverVideo?: string;
  order?: number;
};

export type MdxContentModule<TMeta extends MdxContentMetadataBase> = {
  default: ComponentType<{ children?: ReactNode }>;
  metadata: TMeta;
  title?: string;
};

export type MdxContentEntry<TMeta extends MdxContentMetadataBase> = TMeta & {
  slug: string;
  title: string;
  Page: ComponentType<{ children?: ReactNode }>;
};

type BuildOptions = {
  label: string;
};

function slugFromPath(path: string): string {
  const match = /\/([^/]+)\.mdx$/.exec(path);
  return match?.[1] ?? "";
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveTitle<TMeta extends MdxContentMetadataBase>(
  mod: MdxContentModule<TMeta>,
  slug: string,
  label: string,
): string {
  const title = mod.title?.trim();

  if (title) return title;

  if (import.meta.env.DEV) {
    console.warn(
      `[${label}] No # heading in MDX for "${slug}"; using slug as title.`,
    );
  }

  return slugToTitle(slug);
}

function resolveAssetUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return undefined;
}

export function buildMdxContentRegistry<TMeta extends MdxContentMetadataBase>(
  modules: Record<string, MdxContentModule<TMeta>>,
  { label }: BuildOptions,
): MdxContentEntry<TMeta>[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = slugFromPath(path);

      return {
        slug,
        title: resolveTitle(mod, slug, label),
        ...mod.metadata,
        cover: resolveAssetUrl(mod.metadata.cover),
        coverVideo: resolveAssetUrl(mod.metadata.coverVideo),
        Page: mod.default,
      };
    })
    .sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title);
    });
}

export function findContentBySlug<TMeta extends MdxContentMetadataBase>(
  entries: MdxContentEntry<TMeta>[],
  slug: string | undefined,
): MdxContentEntry<TMeta> | undefined {
  if (!slug) return undefined;
  return entries.find((entry) => entry.slug === slug);
}

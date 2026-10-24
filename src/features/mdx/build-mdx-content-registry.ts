import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";
import { resolveOptionalCoverAsset } from "./resolve-cover-asset";

export type MdxContentMetadataBase = {
  title?: string;
  cover?: string;
  coverVideo?: string;
  order?: number;
};

export type MdxContentModule<TMeta extends MdxContentMetadataBase> = {
  default: ComponentType<{ children?: ReactNode }>;
  metadata?: TMeta;
};

export type MdxPageComponent = ComponentType<{ children?: ReactNode }>;

export type MdxContentEntry<TMeta extends MdxContentMetadataBase> = Omit<
  TMeta,
  "cover" | "coverVideo" | "title"
> & {
  slug: string;
  title: string;
  cover?: string;
  coverVideo?: string;
  /** Stable lazy page created once at registry build time (not during render). */
  LazyPage: LazyExoticComponent<MdxPageComponent>;
};

type BuildOptions = {
  label: string;
};

function slugFromMetaPath(path: string): string {
  const match = /\/([^/]+)\.meta\.ts$/.exec(path);
  return match?.[1] ?? "";
}

function slugFromMdxPath(path: string): string {
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
  meta: TMeta,
  slug: string,
  label: string,
): string {
  const title = meta.title?.trim();

  if (title) return title;

  if (import.meta.env.DEV) {
    console.warn(
      `[${label}] No metadata.title for "${slug}"; using slug as title.`,
    );
  }

  return slugToTitle(slug);
}

export function buildMdxContentRegistry<TMeta extends MdxContentMetadataBase>(
  metadataByPath: Record<string, TMeta>,
  pageLoaders: Record<string, () => Promise<MdxContentModule<TMeta>>>,
  { label }: BuildOptions,
): MdxContentEntry<TMeta>[] {
  const loadersBySlug = new Map<
    string,
    () => Promise<MdxContentModule<TMeta>>
  >();

  for (const [path, loader] of Object.entries(pageLoaders)) {
    const slug = slugFromMdxPath(path);
    if (slug) loadersBySlug.set(slug, loader);
  }

  return Object.entries(metadataByPath)
    .map(([path, meta]) => {
      const slug = slugFromMetaPath(path);
      const loader = loadersBySlug.get(slug);

      if (!loader && import.meta.env.DEV) {
        console.warn(
          `[${label}] Missing page loader for slug "${slug}" (meta: ${path}).`,
        );
      }

      const { cover, coverVideo, ...rest } = meta;

      return {
        ...rest,
        slug,
        title: resolveTitle(meta, slug, label),
        cover: resolveOptionalCoverAsset(cover),
        coverVideo: resolveOptionalCoverAsset(coverVideo),
        LazyPage: lazy(async () => {
          if (!loader) {
            throw new Error(`[${label}] No page loader for slug "${slug}".`);
          }
          const mod = await loader();
          return { default: mod.default };
        }),
      } as MdxContentEntry<TMeta>;
    })
    .sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title);
    });
}

export function findContentBySlug<TEntry extends { slug: string }>(
  entries: TEntry[],
  slug: string | undefined,
): TEntry | undefined {
  if (!slug) return undefined;
  return entries.find((entry) => entry.slug === slug);
}

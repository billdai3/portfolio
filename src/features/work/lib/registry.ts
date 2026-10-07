import type { ComponentType, ReactNode } from "react";
import type { WorkProjectMetadata } from "./createWorkPage";

type WorkMdxModule = {
  default: ComponentType<{ children?: ReactNode }>;
  metadata: WorkProjectMetadata;
  title?: string;
};

const modules = import.meta.glob<WorkMdxModule>("../../../content/work/*.mdx", {
  eager: true,
});

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

function resolveTitle(mod: WorkMdxModule, slug: string): string {
  const title = mod.title?.trim();

  if (title) return title;

  if (import.meta.env.DEV) {
    console.warn(
      `[work] No # heading in MDX for "${slug}"; using slug as title.`,
    );
  }

  return slugToTitle(slug);
}

function resolveAssetUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return undefined;
}

export type WorkProjectEntry = WorkProjectMetadata & {
  slug: string;
  title: string;
  Page: ComponentType<{ children?: ReactNode }>;
};

export const workProjects: WorkProjectEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path);

    return {
      slug,
      title: resolveTitle(mod, slug),
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

export function getWorkProject(
  slug: string | undefined,
): WorkProjectEntry | undefined {
  if (!slug) return undefined;
  return workProjects.find((p) => p.slug === slug);
}

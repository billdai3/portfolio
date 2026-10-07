import type { ComponentType, ReactNode } from "react";
import type { LabProjectMetadata } from "./createLabPage";

type LabMdxModule = {
  default: ComponentType<{ children?: ReactNode }>;
  metadata: LabProjectMetadata;
  title?: string;
};

const modules = import.meta.glob<LabMdxModule>("../../../content/lab/*.mdx", {
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

function resolveTitle(mod: LabMdxModule, slug: string): string {
  const title = mod.title?.trim();

  if (title) return title;

  if (import.meta.env.DEV) {
    console.warn(
      `[lab] No # heading in MDX for "${slug}"; using slug as title.`,
    );
  }

  return slugToTitle(slug);
}

function resolveCover(cover: LabProjectMetadata["cover"]): string | undefined {
  if (!cover) return undefined;
  if (typeof cover === "string") return cover;
  return undefined;
}

export type LabProjectEntry = LabProjectMetadata & {
  slug: string;
  title: string;
  Page: ComponentType<{ children?: ReactNode }>;
};

export const labProjects: LabProjectEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path);

    return {
      slug,
      title: resolveTitle(mod, slug),
      ...mod.metadata,
      cover: resolveCover(mod.metadata.cover),
      Page: mod.default,
    };
  })
  .sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });

export function getLabProject(
  slug: string | undefined,
): LabProjectEntry | undefined {
  if (!slug) return undefined;
  return labProjects.find((p) => p.slug === slug);
}

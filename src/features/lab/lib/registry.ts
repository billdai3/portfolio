import type { ComponentType, ReactNode } from "react";
import type { LabProjectMetadata } from "./createLabPage";
import { extractMdxTitleWithFallback } from "./extract-mdx-title";

type LabMdxModule = {
  default: ComponentType<{ children?: ReactNode }>;
  metadata: LabProjectMetadata;
};

const modules = import.meta.glob<LabMdxModule>("../../../content/lab/*.mdx", {
  eager: true,
});

const rawModules = import.meta.glob<string>("../../../content/lab/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});

function slugFromPath(path: string): string {
  const match = /\/([^/]+)\.mdx$/.exec(path);
  return match?.[1] ?? "";
}

export type LabProjectEntry = LabProjectMetadata & {
  slug: string;
  title: string;
  Page: ComponentType<{ children?: ReactNode }>;
};

export const labProjects: LabProjectEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path);
    const raw = rawModules[path] ?? "";

    return {
      slug,
      title: extractMdxTitleWithFallback(raw, slug),
      ...mod.metadata,
      Page: mod.default,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getLabProject(
  slug: string | undefined,
): LabProjectEntry | undefined {
  if (!slug) return undefined;
  return labProjects.find((p) => p.slug === slug);
}

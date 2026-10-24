import {
  buildMdxContentRegistry,
  findContentBySlug,
  type MdxContentEntry,
  type MdxContentModule,
} from "@/features/mdx/build-mdx-content-registry";
import type { WorkProjectMetadata } from "./createWorkPage";

type WorkMdxModule = MdxContentModule<WorkProjectMetadata>;

const metadataByPath = import.meta.glob<WorkProjectMetadata>(
  "../../../content/work/*.meta.ts",
  { eager: true, import: "metadata" },
);

const pageLoaders = import.meta.glob<WorkMdxModule>(
  "../../../content/work/*.mdx",
);

export type WorkProjectEntry = MdxContentEntry<WorkProjectMetadata>;

export const workProjects: WorkProjectEntry[] = buildMdxContentRegistry(
  metadataByPath,
  pageLoaders,
  { label: "work" },
);

export function getWorkProject(
  slug: string | undefined,
): WorkProjectEntry | undefined {
  return findContentBySlug(workProjects, slug);
}

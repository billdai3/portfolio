import {
  buildMdxContentRegistry,
  findContentBySlug,
  type MdxContentEntry,
  type MdxContentModule,
} from "@/features/mdx/build-mdx-content-registry";
import type { LabProjectMetadata } from "./createLabPage";

type LabMdxModule = MdxContentModule<LabProjectMetadata>;

const metadataByPath = import.meta.glob<LabProjectMetadata>(
  "../../../content/lab/*.meta.ts",
  { eager: true, import: "metadata" },
);

const pageLoaders = import.meta.glob<LabMdxModule>("../../../content/lab/*.mdx");

export type LabProjectEntry = MdxContentEntry<LabProjectMetadata>;

export const labProjects: LabProjectEntry[] = buildMdxContentRegistry(
  metadataByPath,
  pageLoaders,
  { label: "lab" },
);

export function getLabProject(
  slug: string | undefined,
): LabProjectEntry | undefined {
  return findContentBySlug(labProjects, slug);
}

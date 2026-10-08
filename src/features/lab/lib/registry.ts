import {
  buildMdxContentRegistry,
  findContentBySlug,
  type MdxContentEntry,
  type MdxContentModule,
} from "@/features/mdx/build-mdx-content-registry";
import type { LabProjectMetadata } from "./createLabPage";

type LabMdxModule = MdxContentModule<LabProjectMetadata>;

const modules = import.meta.glob<LabMdxModule>("../../../content/lab/*.mdx", {
  eager: true,
});

export type LabProjectEntry = MdxContentEntry<LabProjectMetadata>;

export const labProjects: LabProjectEntry[] = buildMdxContentRegistry(modules, {
  label: "lab",
});

export function getLabProject(
  slug: string | undefined,
): LabProjectEntry | undefined {
  return findContentBySlug(labProjects, slug);
}

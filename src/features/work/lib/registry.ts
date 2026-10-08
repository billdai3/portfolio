import {
  buildMdxContentRegistry,
  findContentBySlug,
  type MdxContentEntry,
  type MdxContentModule,
} from "@/features/mdx/build-mdx-content-registry";
import type { WorkProjectMetadata } from "./createWorkPage";

type WorkMdxModule = MdxContentModule<WorkProjectMetadata>;

const modules = import.meta.glob<WorkMdxModule>("../../../content/work/*.mdx", {
  eager: true,
});

export type WorkProjectEntry = MdxContentEntry<WorkProjectMetadata>;

export const workProjects: WorkProjectEntry[] = buildMdxContentRegistry(
  modules,
  { label: "work" },
);

export function getWorkProject(
  slug: string | undefined,
): WorkProjectEntry | undefined {
  return findContentBySlug(workProjects, slug);
}

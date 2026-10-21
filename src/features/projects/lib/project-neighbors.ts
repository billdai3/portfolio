import { labProjects } from "@/features/lab/lib/registry";
import { workProjects } from "@/features/work/lib/registry";

export type ProjectSection = "work" | "lab";

export type ProjectNavTarget =
  | { kind: "project"; href: string; title: string; section: ProjectSection }
  | { kind: "home"; href: "/" };

type ProjectChainEntry = {
  section: ProjectSection;
  slug: string;
  href: string;
  title: string;
};

const projectChain: ProjectChainEntry[] = [
  ...workProjects.map((project) => ({
    section: "work" as const,
    slug: project.slug,
    href: `/work/${project.slug}`,
    title: project.title,
  })),
  ...labProjects.map((project) => ({
    section: "lab" as const,
    slug: project.slug,
    href: `/lab/${project.slug}`,
    title: project.title,
  })),
];

function toNavTarget(
  entry: ProjectChainEntry | undefined,
): ProjectNavTarget {
  if (!entry) {
    return { kind: "home", href: "/" };
  }

  return {
    kind: "project",
    href: entry.href,
    title: entry.title,
    section: entry.section,
  };
}

export function getProjectNeighbors(
  section: ProjectSection,
  slug: string | undefined,
): { prev: ProjectNavTarget; next: ProjectNavTarget } | null {
  if (!slug) return null;

  const index = projectChain.findIndex(
    (entry) => entry.section === section && entry.slug === slug,
  );
  if (index === -1) return null;

  return {
    prev: toNavTarget(projectChain[index - 1]),
    next: toNavTarget(projectChain[index + 1]),
  };
}

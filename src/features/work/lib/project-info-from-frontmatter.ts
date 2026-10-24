import type { ProjectInfoItem } from "../components/ProjectInfo";

function isProjectInfoItem(value: unknown): value is ProjectInfoItem {
  if (!value || typeof value !== "object") return false;
  const item = value as { label?: unknown; value?: unknown };
  return (
    (typeof item.label === "string" || typeof item.label === "number") &&
    (typeof item.value === "string" ||
      typeof item.value === "number" ||
      typeof item.value === "boolean")
  );
}

/** Read YAML `projectInfo` array from locked-work frontmatter for safe rendering. */
export function projectInfoFromFrontmatter(
  frontmatter: Record<string, unknown>,
): ProjectInfoItem[] | null {
  const raw = frontmatter.projectInfo;
  if (!Array.isArray(raw)) return null;

  const items = raw.filter(isProjectInfoItem);
  return items.length > 0 ? items : null;
}

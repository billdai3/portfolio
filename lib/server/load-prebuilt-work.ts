import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { PrebuiltWorkEntry } from "../../src/features/work/lib/safe-mdx-types.js";
import { isValidSlug } from "./github.js";

const PREBUILT_DIR = join(process.cwd(), "lib/server/prebuilt-work");

function isPrebuiltWorkEntry(value: unknown): value is PrebuiltWorkEntry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PrebuiltWorkEntry>;
  return (
    typeof candidate.slug === "string" &&
    candidate.frontmatter !== undefined &&
    typeof candidate.frontmatter === "object" &&
    candidate.frontmatter !== null &&
    candidate.document !== undefined &&
    typeof candidate.document === "object" &&
    candidate.document !== null &&
    (candidate.document as { type?: unknown }).type === "root" &&
    Array.isArray((candidate.document as { children?: unknown }).children)
  );
}

export function listPrebuiltWorkSlugs(): string[] {
  if (!existsSync(PREBUILT_DIR)) return [];
  return readdirSync(PREBUILT_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length))
    .filter(isValidSlug);
}

export function readPrebuiltWork(slug: string): PrebuiltWorkEntry | null {
  if (!isValidSlug(slug)) return null;

  const filePath = join(PREBUILT_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;

  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    if (!isPrebuiltWorkEntry(parsed)) return null;
    if (parsed.slug !== slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getPrebuiltWorkDir(): string {
  return PREBUILT_DIR;
}

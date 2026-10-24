/**
 * Bake locked work MDX from the private GitHub repo into
 * lib/server/prebuilt-work/{slug}.json (safe document trees).
 *
 * Run via `npm run prebuild:locked-work` (also hooked into `npm run build`).
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { fetchRepoText, mdxPathForSlug } from "../lib/server/github.js";
import { mdxBodyToSafeDocument } from "../lib/server/mdx-safe-document.js";
import { containsImportOrExport } from "../lib/server/rewrite-media.js";
import type { PrebuiltWorkEntry } from "../src/features/work/lib/safe-mdx-types.js";
import { getPrebuiltWorkDir } from "../lib/server/load-prebuilt-work.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORK_CONTENT_DIR = join(ROOT, "src/content/work");
const OUT_DIR = getPrebuiltWorkDir();

const LOCKED_RE = /\bisLocked\s*:\s*true\b/;

/** Load root `.env` into process.env when keys are unset (local prebuild DX). */
function loadLocalDotEnv(): void {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function hasGitHubEnv(): boolean {
  return Boolean(
    process.env.GITHUB_PRIVATE_TOKEN &&
      process.env.GITHUB_USERNAME &&
      process.env.GITHUB_REPO_NAME,
  );
}

async function discoverLockedSlugs(): Promise<string[]> {
  const entries = await readdir(WORK_CONTENT_DIR);
  const slugs: string[] = [];

  for (const name of entries) {
    if (!name.endsWith(".meta.ts")) continue;
    const raw = await readFile(join(WORK_CONTENT_DIR, name), "utf8");
    if (!LOCKED_RE.test(raw)) continue;
    slugs.push(name.slice(0, -".meta.ts".length));
  }

  return slugs.sort();
}

async function bakeSlug(slug: string): Promise<PrebuiltWorkEntry> {
  const raw = await fetchRepoText(mdxPathForSlug(slug));
  if (raw === null) {
    throw new Error(`Private MDX not found for slug "${slug}"`);
  }

  if (containsImportOrExport(raw)) {
    throw new Error(
      `Private MDX for "${slug}" contains import/export (not allowed)`,
    );
  }

  const { data: frontmatter, content: body } = matter(raw);
  const document = await mdxBodyToSafeDocument(body);

  return {
    slug,
    frontmatter: frontmatter as Record<string, unknown>,
    document,
  };
}

async function clearJsonArtifacts(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const existing = await readdir(OUT_DIR);
  await Promise.all(
    existing
      .filter((name) => name.endsWith(".json"))
      .map((name) => rm(join(OUT_DIR, name), { force: true })),
  );
}

async function main(): Promise<void> {
  loadLocalDotEnv();

  const slugs = await discoverLockedSlugs();
  console.info(
    `[prebuild:locked-work] locked slugs: ${slugs.length ? slugs.join(", ") : "(none)"}`,
  );

  if (slugs.length === 0) {
    await clearJsonArtifacts();
    console.info("[prebuild:locked-work] nothing to bake");
    return;
  }

  if (!hasGitHubEnv()) {
    if (process.env.VERCEL) {
      throw new Error(
        "[prebuild:locked-work] GITHUB_PRIVATE_TOKEN / GITHUB_USERNAME / GITHUB_REPO_NAME are required on Vercel builds",
      );
    }
    throw new Error(
      "[prebuild:locked-work] Missing GITHUB_* env. Set them in .env (or Vercel) then re-run. For unlock locally use `npm run prebuild:locked-work` before `npm run dev:vercel`.",
    );
  }

  await clearJsonArtifacts();

  for (const slug of slugs) {
    const entry = await bakeSlug(slug);
    const outPath = join(OUT_DIR, `${slug}.json`);
    await writeFile(outPath, `${JSON.stringify(entry)}\n`, "utf8");
    console.info(
      `[prebuild:locked-work] wrote ${slug}.json (${entry.document.children.length} root nodes)`,
    );
  }

  console.info(`[prebuild:locked-work] done → ${OUT_DIR}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

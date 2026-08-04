import type { VercelRequest, VercelResponse } from "@vercel/node";
import matter from "gray-matter";
import {
  fetchRepoText,
  isValidSlug,
  mdxPathForSlug,
} from "../lib/server/github";
import {
  containsImportOrExport,
  rewriteMediaPaths,
} from "../lib/server/rewrite-media";
import { isUnlocked } from "../lib/server/session";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isUnlocked(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  if (!isValidSlug(slug)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const raw = await fetchRepoText(mdxPathForSlug(slug));
  if (raw === null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (containsImportOrExport(raw)) {
    return res.status(400).json({ error: "Invalid content" });
  }

  const { data: frontmatter, content } = matter(raw);
  const body = rewriteMediaPaths(content);

  return res.status(200).json({ slug, frontmatter, body });
}

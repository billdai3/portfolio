import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getWorkContentMeta,
  loadWorkContent,
} from "../lib/server/load-work-content";
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
  const metaBeforeLoad = getWorkContentMeta(slug);
  const startedAt = performance.now();
  const result = await loadWorkContent(slug);
  const totalMs = performance.now() - startedAt;

  res.setHeader("Server-Timing", `total;dur=${totalMs.toFixed(1)}`);
  res.setHeader("X-Work-Content-Cache", metaBeforeLoad.cache);

  if (!result.ok) {
    if (result.reason === "invalid-content") {
      return res.status(400).json({ error: "Invalid content" });
    }

    return res.status(401).json({ error: "Unauthorized" });
  }

  const { content } = result;

  res.setHeader("Cache-Control", "private, no-store");
  return res.status(200).json(content);
}

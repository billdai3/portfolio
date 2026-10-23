import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  etagMatches,
  getWorkMediaMeta,
  loadWorkMedia,
} from "../lib/server/load-work-media.js";
import { isUnlocked } from "../lib/server/session.js";

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

  const path = typeof req.query.path === "string" ? req.query.path : "";
  const metaBeforeLoad = getWorkMediaMeta(path);
  const startedAt = performance.now();
  const result = await loadWorkMedia(path);
  const totalMs = performance.now() - startedAt;

  res.setHeader("Server-Timing", `total;dur=${totalMs.toFixed(1)}`);
  res.setHeader("X-Work-Media-Cache", metaBeforeLoad.cache);

  if (!result.ok) {
    if (result.reason === "invalid-path") {
      return res.status(400).json({ error: "Invalid path" });
    }

    if (result.reason === "not-found") {
      return res.status(404).json({ error: "Not found" });
    }

    if (result.reason === "misconfigured") {
      return res.status(500).json({ error: "Server misconfigured" });
    }

    return res.status(502).json({ error: "Failed to load media" });
  }

  const { file } = result;

  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Cache-Control", "private, max-age=86400");
  res.setHeader("ETag", file.etag);

  if (etagMatches(req.headers["if-none-match"], file.etag)) {
    return res.status(304).end();
  }

  return res.status(200).send(Buffer.from(file.body));
}

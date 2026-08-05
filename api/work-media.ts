import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  etagMatches,
  getWorkMediaMeta,
  loadWorkMedia,
} from "../lib/server/load-work-media";
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

  const path = typeof req.query.path === "string" ? req.query.path : "";
  const metaBeforeLoad = getWorkMediaMeta(path);
  const startedAt = performance.now();
  const result = await loadWorkMedia(path);
  const totalMs = performance.now() - startedAt;

  res.setHeader("Server-Timing", `total;dur=${totalMs.toFixed(1)}`);
  res.setHeader("X-Work-Media-Cache", metaBeforeLoad.cache);

  if (!result.ok) {
    return res.status(401).json({ error: "Unauthorized" });
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

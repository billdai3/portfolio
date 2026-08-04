import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadWorkMedia } from "../lib/server/load-work-media";
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
  const result = await loadWorkMedia(path);
  if (!result.ok) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { file } = result;

  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Cache-Control", "private, max-age=60");
  return res.status(200).send(Buffer.from(file.body));
}

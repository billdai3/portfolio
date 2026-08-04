import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRepoBinary, isValidAssetPath } from "../lib/server/github";
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
  if (!isValidAssetPath(path)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const file = await fetchRepoBinary(path);
  if (!file) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Cache-Control", "private, max-age=3600");
  return res.status(200).send(Buffer.from(file.body));
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { toSupabaseObjectKey } from "../lib/server/load-work-media.js";
import { isUnlocked } from "../lib/server/session.js";
import { createSignedMediaUrl } from "../lib/server/sign-work-media.js";
import { getSupabaseAdminClient } from "../lib/server/supabase.js";

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
  if (!toSupabaseObjectKey(path)) {
    return res.status(400).json({ error: "Invalid path" });
  }

  const signedUrl = await createSignedMediaUrl(path);
  if (!signedUrl) {
    if (!getSupabaseAdminClient()) {
      return res.status(500).json({ error: "Server misconfigured" });
    }
    return res.status(502).json({ error: "Failed to sign media URL" });
  }

  return res.redirect(302, signedUrl);
}

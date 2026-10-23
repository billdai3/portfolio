import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadWorkContent } from "../lib/server/load-work-content.js";
import { passwordsMatch } from "../lib/server/password.js";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "../lib/server/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "DELETE") {
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!passwordsMatch(password, process.env.WORK_UNLOCK_PASSWORD)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = createSessionToken();
  if (!token) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const slug = typeof req.body?.slug === "string" ? req.body.slug : "";
  setSessionCookie(res, token);

  if (!slug) {
    return res.status(200).json({ ok: true });
  }

  const result = await loadWorkContent(slug);
  if (!result.ok) {
    return res.status(200).json({ ok: true, contentError: result.reason });
  }

  return res.status(200).json({ ok: true, ...result.content });
}

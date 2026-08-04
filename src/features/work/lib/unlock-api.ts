export async function fetchSessionUnlocked(
  signal?: AbortSignal,
): Promise<boolean> {
  const res = await fetch("/api/work-session", {
    credentials: "same-origin",
    signal,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { unlocked?: boolean };
  return data.unlocked === true;
}

export type LockedContentResult =
  | { body: string; frontmatter: Record<string, unknown> }
  | "unauthorized"
  | "error";

export async function fetchLockedContent(
  slug: string,
  signal?: AbortSignal,
): Promise<LockedContentResult> {
  const res = await fetch(
    `/api/work-content?slug=${encodeURIComponent(slug)}`,
    { credentials: "same-origin", signal },
  );

  if (res.status === 401) return "unauthorized";
  if (!res.ok) return "error";

  const data = (await res.json()) as {
    body?: string;
    frontmatter?: Record<string, unknown>;
  };
  if (typeof data.body !== "string") return "error";
  return {
    body: data.body,
    frontmatter:
      data.frontmatter && typeof data.frontmatter === "object"
        ? data.frontmatter
        : {},
  };
}

export type DetailFromPath = "/" | "/work" | "/lab";

export type DetailLocationState = {
  from: DetailFromPath;
};

const DETAIL_FROM_PATHS = new Set<DetailFromPath>(["/", "/work", "/lab"]);

export function getDetailFrom(state: unknown): DetailFromPath | undefined {
  if (!state || typeof state !== "object") return undefined;

  const from = (state as { from?: unknown }).from;
  if (typeof from !== "string") return undefined;
  if (!DETAIL_FROM_PATHS.has(from as DetailFromPath)) return undefined;

  return from as DetailFromPath;
}

export function toDetailLocationState(
  from: DetailFromPath | undefined,
): DetailLocationState | undefined {
  return from ? { from } : undefined;
}

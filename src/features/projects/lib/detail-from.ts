import type { To } from "react-router-dom";

export type DetailFromPath = "/" | "/work" | "/lab";

export type DetailFromHash = "home-work" | "home-lab";

export type DetailLocationState = {
  from: DetailFromPath;
  hash?: DetailFromHash;
};

const DETAIL_FROM_PATHS = new Set<DetailFromPath>(["/", "/work", "/lab"]);
const DETAIL_FROM_HASHES = new Set<DetailFromHash>(["home-work", "home-lab"]);

export function parseDetailLocationState(
  state: unknown,
): DetailLocationState | undefined {
  if (!state || typeof state !== "object") return undefined;

  const from = (state as { from?: unknown }).from;
  if (typeof from !== "string") return undefined;
  if (!DETAIL_FROM_PATHS.has(from as DetailFromPath)) return undefined;

  const rawHash = (state as { hash?: unknown }).hash;
  let hash: DetailFromHash | undefined;
  if (typeof rawHash === "string" && DETAIL_FROM_HASHES.has(rawHash as DetailFromHash)) {
    hash = rawHash as DetailFromHash;
  }

  return hash ? { from: from as DetailFromPath, hash } : { from: from as DetailFromPath };
}

export function toDetailLocationState(input: {
  from?: DetailFromPath;
  hash?: DetailFromHash;
}): DetailLocationState | undefined {
  if (!input.from) return undefined;
  return parseDetailLocationState({
    from: input.from,
    hash: input.hash,
  });
}

/** Build a react-router `To` that preserves optional home-section hash. */
export function toDetailNavigateTo(state: DetailLocationState): To {
  if (state.hash) {
    return { pathname: state.from, hash: `#${state.hash}` };
  }
  return state.from;
}

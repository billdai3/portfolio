const SLUG_RE = /^[a-z0-9-]+$/;
const ASSET_PATH_RE = /^assets\/[a-zA-Z0-9._/-]+$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function isValidAssetPath(path: string): boolean {
  if (!ASSET_PATH_RE.test(path)) return false;
  if (path.includes("..")) return false;
  if (path.includes("//")) return false;
  return true;
}

export function mdxPathForSlug(slug: string): string {
  return `${slug}.mdx`;
}

type GitHubEnv = {
  token: string;
  owner: string;
  repo: string;
};

function getGitHubEnv(): GitHubEnv | null {
  const token = process.env.GITHUB_PRIVATE_TOKEN;
  const owner = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!token || !owner || !repo) return null;
  return { token, owner, repo };
}

async function fetchGitHubContents(
  path: string,
  accept: string,
): Promise<Response | null> {
  const env = getGitHubEnv();
  if (!env) return null;

  const url = `https://api.github.com/repos/${env.owner}/${env.repo}/contents/${encodeURI(path)}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${env.token}`,
      Accept: accept,
      "User-Agent": "portfolio-unlock",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

export async function fetchRepoText(path: string): Promise<string | null> {
  const res = await fetchGitHubContents(
    path,
    "application/vnd.github.raw+json",
  );
  if (!res || !res.ok) return null;
  return res.text();
}

export async function fetchRepoBinary(
  path: string,
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const res = await fetchGitHubContents(
    path,
    "application/vnd.github.raw+json",
  );
  if (!res || !res.ok) return null;

  const contentType =
    res.headers.get("content-type") ?? guessContentType(path);
  const body = await res.arrayBuffer();
  return { body, contentType };
}

function guessContentType(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

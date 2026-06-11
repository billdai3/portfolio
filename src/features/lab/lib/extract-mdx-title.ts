import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function extractMdxTitle(source: string): string | undefined {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);

  let title: string | undefined;

  visit(tree, "heading", (node) => {
    if (!title && node.depth === 1) {
      title = toString(node).trim();
    }
  });

  return title;
}

export function extractMdxTitleWithFallback(
  source: string,
  slug: string,
): string {
  const title = extractMdxTitle(source);

  if (!title) {
    if (import.meta.env.DEV) {
      console.warn(
        `[lab] No # heading in MDX for "${slug}"; using slug as title.`,
      );
    }
    return slugToTitle(slug);
  }

  return title;
}

import type {
  BlockContent,
  Code,
  Content,
  Delete,
  Emphasis,
  Heading,
  Image,
  InlineCode,
  Link,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
} from "mdast";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import {
  SAFE_MDX_COMPONENT_NAME_SET,
  type SafeMdxDocument,
  type SafeMdxNode,
  type SafeMdxPropValue,
} from "../../src/features/work/lib/safe-mdx-types.js";

/** Minimal MDX JSX typings (avoid hard dep on mdast-util-mdx-jsx exports). */
type MdxJsxAttributeValueExpression = {
  type: "mdxJsxAttributeValueExpression";
  value: string;
};

type MdxJsxAttribute = {
  type: "mdxJsxAttribute";
  name: string;
  value?: string | MdxJsxAttributeValueExpression | null;
};

type MdxJsxExpressionAttribute = {
  type: "mdxJsxExpressionAttribute";
  value: string;
};

type MdxJsxElement = {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement";
  name: string | null;
  attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[];
  children: Content[];
};

type MdxJsxFlowElement = MdxJsxElement & { type: "mdxJsxFlowElement" };
type MdxJsxTextElement = MdxJsxElement & { type: "mdxJsxTextElement" };
/**
 * Normalize ProjectInfo JSX to a prop-less marker so expression props like
 * `items={projectInfo}` do not fail the safe parser, while keeping document order.
 */
export function normalizeProjectInfoJsx(body: string): string {
  return body
    .replace(/<ProjectInfo\b[^>]*\/>/g, "<ProjectInfo />")
    .replace(/<ProjectInfo\b[^>]*>[\s\S]*?<\/ProjectInfo>/g, "<ProjectInfo />");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function assertNeverForbidden(node: { type: string }): never {
  throw new Error(`Unsafe or unsupported MDX node: ${node.type}`);
}

function jsxAttributeValue(
  attr: MdxJsxAttribute | MdxJsxExpressionAttribute,
): { name: string; value: SafeMdxPropValue } | null {
  if (attr.type === "mdxJsxExpressionAttribute") {
    throw new Error("MDX expression attributes are not allowed");
  }

  const { name, value } = attr;
  if (value == null) {
    return { name, value: true };
  }
  if (typeof value === "string") {
    return { name, value };
  }
  if (typeof value === "object" && value.type === "mdxJsxAttributeValueExpression") {
    throw new Error(
      `MDX expression prop "{${value.value}}" on "${name}" is not allowed`,
    );
  }
  throw new Error(`Unsupported JSX attribute value for "${name}"`);
}

function jsxProps(
  attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[],
): Record<string, SafeMdxPropValue> {
  const props: Record<string, SafeMdxPropValue> = {};
  for (const attr of attributes) {
    const parsed = jsxAttributeValue(attr);
    if (parsed) props[parsed.name] = parsed.value;
  }
  return props;
}

function convertJsxElement(
  node: MdxJsxFlowElement | MdxJsxTextElement,
): SafeMdxNode {
  const name = node.name;
  if (!name || !SAFE_MDX_COMPONENT_NAME_SET.has(name)) {
    throw new Error(
      `JSX component <${name ?? "unknown"}> is not in the allowlist`,
    );
  }

  return {
    type: "component",
    name,
    props: jsxProps(node.attributes),
    children: (node.children as Content[]).flatMap(convertContent),
  };
}

function convertText(node: Text): SafeMdxNode {
  return { type: "text", value: node.value };
}

function convertPhrasing(node: PhrasingContent): SafeMdxNode[] {
  switch (node.type) {
    case "text":
      return [convertText(node)];
    case "emphasis":
      return [
        {
          type: "element",
          tagName: "em",
          props: {},
          children: (node as Emphasis).children.flatMap(convertPhrasing),
        },
      ];
    case "strong":
      return [
        {
          type: "element",
          tagName: "strong",
          props: {},
          children: (node as Strong).children.flatMap(convertPhrasing),
        },
      ];
    case "delete":
      return [
        {
          type: "element",
          tagName: "del",
          props: {},
          children: (node as Delete).children.flatMap(convertPhrasing),
        },
      ];
    case "inlineCode":
      return [
        {
          type: "element",
          tagName: "code",
          props: {},
          children: [{ type: "text", value: (node as InlineCode).value }],
        },
      ];
    case "break":
      return [{ type: "element", tagName: "br", props: {}, children: [] }];
    case "link": {
      const link = node as Link;
      return [
        {
          type: "element",
          tagName: "a",
          props: {
            href: link.url,
            ...(link.title ? { title: link.title } : {}),
          },
          children: link.children.flatMap(convertPhrasing),
        },
      ];
    }
    case "image": {
      const image = node as Image;
      return [
        {
          type: "element",
          tagName: "img",
          props: {
            src: image.url,
            ...(image.alt ? { alt: image.alt } : {}),
            ...(image.title ? { title: image.title } : {}),
          },
          children: [],
        },
      ];
    }
    case "mdxJsxTextElement":
      return [convertJsxElement(node as MdxJsxTextElement)];
    case "mdxTextExpression":
      throw new Error("MDX text expressions are not allowed");
    default:
      assertNeverForbidden(node);
  }
}

function convertHeading(node: Heading): SafeMdxNode {
  return {
    type: "element",
    tagName: `h${node.depth}`,
    props: {},
    children: node.children.flatMap(convertPhrasing),
  };
}

function convertParagraph(node: Paragraph): SafeMdxNode {
  return {
    type: "element",
    tagName: "p",
    props: {},
    children: node.children.flatMap(convertPhrasing),
  };
}

function convertList(node: List): SafeMdxNode {
  return {
    type: "element",
    tagName: node.ordered ? "ol" : "ul",
    props: {},
    children: node.children.map((item: ListItem) => ({
      type: "element" as const,
      tagName: "li",
      props: {},
      children: item.children.flatMap(convertBlock),
    })),
  };
}

function convertCode(node: Code): SafeMdxNode {
  const className = node.lang ? `language-${node.lang}` : undefined;
  return {
    type: "element",
    tagName: "pre",
    props: {},
    children: [
      {
        type: "element",
        tagName: "code",
        props: {
          ...(className ? { className } : {}),
          ...(node.lang ? { "data-language": node.lang } : {}),
        },
        children: [{ type: "text", value: node.value }],
      },
    ],
  };
}

function convertTableCell(
  node: TableCell,
  tagName: "td" | "th",
): SafeMdxNode {
  return {
    type: "element",
    tagName,
    props: {},
    children: node.children.flatMap(convertPhrasing),
  };
}

function convertTableRow(node: TableRow, isHeader: boolean): SafeMdxNode {
  return {
    type: "element",
    tagName: "tr",
    props: {},
    children: node.children.map((cell) =>
      convertTableCell(cell, isHeader ? "th" : "td"),
    ),
  };
}

function convertTable(node: Table): SafeMdxNode {
  const [header, ...bodyRows] = node.children;
  const children: SafeMdxNode[] = [];
  if (header) {
    children.push({
      type: "element",
      tagName: "thead",
      props: {},
      children: [convertTableRow(header, true)],
    });
  }
  if (bodyRows.length > 0) {
    children.push({
      type: "element",
      tagName: "tbody",
      props: {},
      children: bodyRows.map((row) => convertTableRow(row, false)),
    });
  }
  return { type: "element", tagName: "table", props: {}, children };
}

function convertBlock(node: BlockContent | RootContent): SafeMdxNode[] {
  return convertContent(node as Content);
}

function convertContent(node: Content | RootContent): SafeMdxNode[] {
  switch (node.type) {
    case "paragraph":
      return [convertParagraph(node as Paragraph)];
    case "heading":
      return [convertHeading(node as Heading)];
    case "thematicBreak":
      return [{ type: "element", tagName: "hr", props: {}, children: [] }];
    case "blockquote":
      return [
        {
          type: "element",
          tagName: "blockquote",
          props: {},
          children: (node as { children: RootContent[] }).children.flatMap(
            convertBlock,
          ),
        },
      ];
    case "list":
      return [convertList(node as List)];
    case "code":
      return [convertCode(node as Code)];
    case "table":
      return [convertTable(node as Table)];
    case "mdxJsxFlowElement":
      return [convertJsxElement(node as MdxJsxFlowElement)];
    case "mdxjsEsm":
      throw new Error("MDX import/export (esm) is not allowed");
    case "mdxFlowExpression":
      throw new Error("MDX flow expressions are not allowed");
    case "html":
      throw new Error("Raw HTML in MDX is not allowed");
    case "yaml":
    case "toml":
      return [];
    case "definition":
    case "footnoteDefinition":
      return [];
    default:
      // listItem / tableRow etc. should be handled by parents
      if (
        node.type === "listItem" ||
        node.type === "tableRow" ||
        node.type === "tableCell"
      ) {
        assertNeverForbidden(node);
      }
      // Phrasing left at block level (unusual) — try phrasing
      if (
        node.type === "text" ||
        node.type === "emphasis" ||
        node.type === "strong" ||
        node.type === "delete" ||
        node.type === "inlineCode" ||
        node.type === "break" ||
        node.type === "link" ||
        node.type === "image" ||
        node.type === "mdxJsxTextElement" ||
        node.type === "mdxTextExpression"
      ) {
        return convertPhrasing(node as PhrasingContent);
      }
      assertNeverForbidden(node);
  }
}

function assertNoForbiddenNodes(tree: Root): void {
  const stack: unknown[] = [...tree.children];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!isRecord(current) || typeof current.type !== "string") continue;

    const type = current.type;
    if (
      type === "mdxjsEsm" ||
      type === "mdxFlowExpression" ||
      type === "mdxTextExpression" ||
      type === "mdxJsxExpressionAttribute"
    ) {
      throw new Error(`Forbidden MDX node type: ${type}`);
    }

    if (type === "mdxJsxAttribute" && isRecord(current.value)) {
      if (current.value.type === "mdxJsxAttributeValueExpression") {
        throw new Error("MDX expression attribute values are not allowed");
      }
    }

    if (Array.isArray(current.children)) {
      stack.push(...current.children);
    }
    if (Array.isArray(current.attributes)) {
      stack.push(...current.attributes);
    }
  }
}

/** Parse locked MDX body into a serializable safe document tree. */
export async function mdxBodyToSafeDocument(
  body: string,
): Promise<SafeMdxDocument> {
  const prepared = normalizeProjectInfoJsx(body);
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .parse(prepared) as Root;
  assertNoForbiddenNodes(tree);

  return {
    type: "root",
    children: tree.children.flatMap(convertContent),
  };
}

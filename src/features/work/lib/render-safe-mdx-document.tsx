import {
  createElement,
  Fragment,
  type ComponentType,
  type ReactNode,
} from "react";
import type { MDXComponents } from "mdx/types";
import type { SafeMdxDocument, SafeMdxNode, SafeMdxPropValue } from "./safe-mdx-types";

function toReactProps(
  props: Record<string, SafeMdxPropValue>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    // DOM / React: class → className already stored as className in our converter
    out[key] = value;
  }
  return out;
}

function renderNode(
  node: SafeMdxNode,
  components: MDXComponents,
  key: string | number,
): ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  const children =
    node.children.length > 0
      ? node.children.map((child, index) =>
          renderNode(child, components, `${key}.${index}`),
        )
      : undefined;

  if (node.type === "component") {
    const Comp = components[node.name as keyof MDXComponents] as
      | ComponentType<Record<string, unknown>>
      | undefined;
    if (!Comp) {
      throw new Error(`Unknown MDX component: ${node.name}`);
    }
    return createElement(
      Comp,
      { key, ...toReactProps(node.props) },
      children,
    );
  }

  const Override = components[node.tagName as keyof MDXComponents] as
    | ComponentType<Record<string, unknown>>
    | string
    | undefined;

  if (typeof Override === "function" || typeof Override === "string") {
    return createElement(
      Override,
      { key, ...toReactProps(node.props) },
      children,
    );
  }

  // Intrinsic fallback when no MDX override is registered.
  if (node.tagName === "br" || node.tagName === "hr") {
    return createElement(node.tagName, { key, ...toReactProps(node.props) });
  }

  return createElement(
    node.tagName,
    { key, ...toReactProps(node.props) },
    children,
  );
}

export function SafeMdxDocumentView({
  document,
  components,
}: {
  document: SafeMdxDocument;
  components: MDXComponents;
}) {
  return createElement(
    Fragment,
    null,
    document.children.map((child, index) =>
      renderNode(child, components, index),
    ),
  );
}

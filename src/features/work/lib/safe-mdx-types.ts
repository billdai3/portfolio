/** Serializable MDX subset — no expressions, no ESM. Shared by server bake + client render. */

export type SafeMdxPropValue = string | number | boolean;

export type SafeMdxNode =
  | { type: "text"; value: string }
  | {
      type: "element";
      tagName: string;
      props: Record<string, SafeMdxPropValue>;
      children: SafeMdxNode[];
    }
  | {
      type: "component";
      name: string;
      props: Record<string, SafeMdxPropValue>;
      children: SafeMdxNode[];
    };

export type SafeMdxDocument = {
  type: "root";
  children: SafeMdxNode[];
};

export type PrebuiltWorkEntry = {
  slug: string;
  frontmatter: Record<string, unknown>;
  document: SafeMdxDocument;
};

/** JSX component names allowed in locked / remote MDX. */
export const SAFE_MDX_COMPONENT_NAMES = [
  "Media",
  "Carousel",
  "Comparison",
  "ProjectInfo",
] as const;

export type SafeMdxComponentName = (typeof SAFE_MDX_COMPONENT_NAMES)[number];

export const SAFE_MDX_COMPONENT_NAME_SET = new Set<string>(SAFE_MDX_COMPONENT_NAMES);

/** Media-related prop keys rewritten to signed / proxy URLs. */
export const SAFE_MDX_MEDIA_PROP_KEYS = [
  "src",
  "poster",
  "before",
  "after",
] as const;

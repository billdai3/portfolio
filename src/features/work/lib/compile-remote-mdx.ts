import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import type { ComponentType, ReactNode } from "react";
import { workMdxComponents } from "../components/mdx-components";

export type CompiledRemoteMdx = {
  Content: ComponentType<{ children?: ReactNode }>;
};

const IDENTIFIER_RE = /^[A-Za-z_$][\w$]*$/;

/** Turn YAML frontmatter into `export const` bindings so MDX can use e.g. `projectInfo`. */
function injectFrontmatterScope(
  body: string,
  frontmatter: Record<string, unknown>,
): string {
  const bindings = Object.entries(frontmatter)
    .filter(([key]) => IDENTIFIER_RE.test(key))
    .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
    .join("\n");

  return bindings ? `${bindings}\n\n${body}` : body;
}

/** Compile MDX body (+ optional frontmatter scope) into a React component. */
export async function compileRemoteMdx(
  body: string,
  frontmatter: Record<string, unknown> = {},
): Promise<CompiledRemoteMdx> {
  const source = injectFrontmatterScope(body, frontmatter);

  const evaluated = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    // Inject directly so Vite dual-instances of @mdx-js/react cannot break Context.
    useMDXComponents: () => workMdxComponents,
  });

  return {
    Content: evaluated.default as ComponentType<{ children?: ReactNode }>,
  };
}

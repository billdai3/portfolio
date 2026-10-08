import type { MDXComponents } from "mdx/types";
import {
  baseMdxComponents,
  createMdxImgComponent,
  type MdxElProps,
} from "@/features/mdx/base-mdx-components";
import { Carousel, Comparison, Media } from "@/features/work/components/mdx-media";

export const labMdxComponents: MDXComponents = {
  ...baseMdxComponents,
  Media,
  Carousel,
  Comparison,
  img: createMdxImgComponent(Media),
  figure: ({ children, ...props }: MdxElProps) => (
    <figure
      className="mb-6 overflow-hidden rounded-xl border border-border-default bg-bg-card"
      {...props}
    >
      {children}
    </figure>
  ),
  pre: ({ children, ...props }: MdxElProps) => (
    <pre
      className="overflow-x-auto p-4 font-mono text-sm leading-relaxed [&>code]:block [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
      {...props}
    >
      {children}
    </pre>
  ),
};

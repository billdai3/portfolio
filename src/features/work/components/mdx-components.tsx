import type { MDXComponents } from "mdx/types";
import {
  baseMdxComponents,
  createMdxImgComponent,
  type MdxElProps,
} from "@/features/mdx/base-mdx-components";
import { Carousel, Comparison, Media } from "./mdx-media";
import { ProjectInfo } from "./ProjectInfo";

export const workMdxComponents: MDXComponents = {
  ...baseMdxComponents,
  ProjectInfo,
  Media,
  Carousel,
  Comparison,
  img: createMdxImgComponent(Media),
  pre: ({ children, ...props }: MdxElProps) => (
    <pre
      className="overflow-x-auto rounded-xl border border-border-default bg-bg-card p-4 font-mono text-sm leading-relaxed [&>code]:block [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
      {...props}
    >
      {children}
    </pre>
  ),
};

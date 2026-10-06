import type { MDXComponents } from "mdx/types";
import {
  baseMdxComponents,
  isBlockCode,
  type MdxCodeProps,
  type MdxElProps,
} from "@/features/mdx/base-mdx-components";
import { Carousel, Comparison, Media } from "@/features/work/components/mdx-media";

export const labMdxComponents: MDXComponents = {
  ...baseMdxComponents,
  Media,
  Carousel,
  Comparison,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Media src={src ?? ""} alt={alt} width="default" />
  ),
  figure: ({ children, ...props }: MdxElProps) => (
    <figure
      className="mb-6 overflow-hidden rounded-xl border border-border-default bg-bg-card"
      {...props}
    >
      {children}
    </figure>
  ),
  code: ({ children, className, ...props }: MdxCodeProps) => {
    if (isBlockCode({ className, ...props })) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded bg-bg-card px-1.5 py-0.5 font-mono text-sm text-ash-100"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: MdxElProps) => (
    <pre
      className="overflow-x-auto p-4 font-mono text-sm leading-relaxed [&>code]:block [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
      {...props}
    >
      {children}
    </pre>
  ),
};

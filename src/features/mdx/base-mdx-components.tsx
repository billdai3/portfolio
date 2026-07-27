import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

export type MdxElProps = { children?: ReactNode };

export type MdxCodeProps = MdxElProps & {
  className?: string;
  "data-language"?: string;
};

export function isBlockCode({
  className,
  "data-language": dataLanguage,
}: MdxCodeProps) {
  return Boolean(dataLanguage ?? className?.includes("language-"));
}

/** Shared MDX typography — Lab / Work extend with their own figure / img / code. */
export const baseMdxComponents: MDXComponents = {
  h1: ({ children }: MdxElProps) => (
    <h1 className="type-page-title mb-4 text-text-primary">{children}</h1>
  ),
  h2: ({ children }: MdxElProps) => (
    <h2 className="font-display text-[1.5rem] font-extrabold leading-tight tracking-tight mb-3 text-text-primary not-first:mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }: MdxElProps) => (
    <h3 className="font-display text-[1rem] font-extrabold leading-tight tracking-tight mt-4 mb-3 text-text-primary">
      {children}
    </h3>
  ),
  p: ({ children }: MdxElProps) => (
    <p className="mb-2 text-[1rem] leading-[1.75] text-text-secondary">
      {children}
    </p>
  ),
  ul: ({ children }: MdxElProps) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-text-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }: MdxElProps) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-text-secondary">
      {children}
    </ol>
  ),
  li: ({ children }: MdxElProps) => (
    <li className="leading-relaxed [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>
  ),
  a: ({ href, children }: MdxElProps & { href?: string }) => (
    <a
      href={href}
      className="text-accent underline-offset-4 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: MdxElProps) => (
    <blockquote className="mb-6 border-l-4 border-border-strong pl-4 text-text-secondary">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border-default" />,
  table: ({ children }: MdxElProps) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: MdxElProps) => (
    <thead className="bg-bg-card">{children}</thead>
  ),
  tbody: ({ children }: MdxElProps) => <tbody>{children}</tbody>,
  tr: ({ children }: MdxElProps) => <tr>{children}</tr>,
  th: ({ children }: MdxElProps) => (
    <th className="border border-border-default px-3 py-2 text-left align-top font-extrabold text-text-primary">
      {children}
    </th>
  ),
  td: ({ children }: MdxElProps) => (
    <td className="border border-border-default px-3 py-2 align-top text-text-secondary">
      {children}
    </td>
  ),
};

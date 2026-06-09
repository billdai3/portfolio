import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

type MdxElProps = { children?: ReactNode };

export const labMdxComponents: MDXComponents = {
  h1: ({ children }: MdxElProps) => (
    <h2 className="type-section-title mb-6 text-text-primary not-first:mt-12">
      {children}
    </h2>
  ),
  h2: ({ children }: MdxElProps) => (
    <h3 className="mt-10 mb-4 text-xl font-extrabold tracking-tight text-text-primary">
      {children}
    </h3>
  ),
  h3: ({ children }: MdxElProps) => (
    <h4 className="mt-8 mb-3 text-lg font-extrabold text-text-primary">{children}</h4>
  ),
  p: ({ children }: MdxElProps) => (
    <p className="mb-4 text-base leading-relaxed text-text-secondary">
      {children}
    </p>
  ),
  ul: ({ children }: MdxElProps) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-text-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }: MdxElProps) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-text-secondary">
      {children}
    </ol>
  ),
  li: ({ children }: MdxElProps) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({
    href,
    children,
  }: MdxElProps & { href?: string }) => (
    <a
      href={href}
      className="text-accent underline-offset-4 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children }: MdxElProps) => (
    <code className="rounded bg-bg-card px-1.5 py-0.5 font-mono text-sm text-ash-100">
      {children}
    </code>
  ),
  pre: ({ children }: MdxElProps) => (
    <pre className="mb-6 overflow-x-auto rounded-xl border border-border-default bg-bg-card p-4 text-sm leading-relaxed text-ash-100">
      {children}
    </pre>
  ),
  blockquote: ({ children }: MdxElProps) => (
    <blockquote className="mb-6 border-l-4 border-accent pl-4 text-text-secondary">
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
    <th className="border border-border-default px-3 py-2 text-left font-extrabold text-text-primary">
      {children}
    </th>
  ),
  td: ({ children }: MdxElProps) => (
    <td className="border border-border-default px-3 py-2 text-text-secondary">
      {children}
    </td>
  ),
};

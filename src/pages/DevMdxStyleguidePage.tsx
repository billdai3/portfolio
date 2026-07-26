import { MDXProvider } from "@mdx-js/react";
import StyleguideMdx from "../content/dev/mdx-styleguide.mdx";
import { labMdxComponents } from "../features/lab/components/mdx-components";

export default function DevMdxStyleguidePage() {
  return (
    <div className="bg-bg-page text-text-primary">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-border-default pb-6">
          <p className="type-btn text-xs text-text-muted">Dev only</p>
          <p className="mt-2 text-sm text-text-secondary">
            預覽共用 MDX 樣式（base + Lab overlays）；改 base-mdx-components /
            lab mdx-components 後重新整理此頁。
          </p>
        </header>
        <MDXProvider components={labMdxComponents}>
          <article className="lab-prose max-w-none">
            <StyleguideMdx />
          </article>
        </MDXProvider>
      </div>
    </div>
  );
}

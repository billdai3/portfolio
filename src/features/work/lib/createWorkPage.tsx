import type { ReactNode } from "react";
import WorkProjectLayout from "../components/WorkProjectLayout";

export type WorkProjectMetadata = {
  /** List / document title; prefer this over relying on the MDX H1 alone. */
  title?: string;
  tag: string;
  /** Optional; unused by list/detail UI today (reserved for future teaser/SEO). */
  summary?: string;
  /** List card thumbnail; `./assets/<slug>/cover…` path (resolved by cover registry). */
  cover?: string;
  /** Optional list-card hover video; `./assets/<slug>/cover-hover…` path. */
  coverVideo?: string;
  /** When true, detail body is fetched from the secret repo after unlock. */
  isLocked?: boolean;
  /** Lower sorts earlier in lists; omit to sort last. */
  order?: number;
};

type CreateWorkPageOptions = {
  metadata: WorkProjectMetadata;
};

export function createWorkPage(_options: CreateWorkPageOptions) {
  void _options;

  return function WorkMdxPage({ children }: { children?: ReactNode }) {
    return <WorkProjectLayout>{children}</WorkProjectLayout>;
  };
}

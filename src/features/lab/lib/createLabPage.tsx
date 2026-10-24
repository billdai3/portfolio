import type { ComponentType, ReactNode } from "react";
import LabProjectLayout from "../components/LabProjectLayout";

export type LabProjectMetadata = {
  /** List / document title; prefer this over relying on the MDX H1 alone. */
  title?: string;
  tag: string;
  summary: string;
  /** List card thumbnail; `./assets/<slug>/cover…` path (resolved by cover registry). */
  cover?: string;
  /** Optional list-card hover video; `./assets/<slug>/cover-hover…` path. */
  coverVideo?: string;
  /** Lower sorts earlier in lists; omit to sort last. */
  order?: number;
};

type CreateLabPageOptions = {
  /** Interactive demo; omit for image/article-only lab projects. */
  Sketch?: ComponentType;
  metadata: LabProjectMetadata;
};

export function createLabPage({ Sketch }: CreateLabPageOptions) {
  return function LabMdxPage({ children }: { children?: ReactNode }) {
    return (
      <LabProjectLayout demo={Sketch ? <Sketch /> : undefined}>
        {children}
      </LabProjectLayout>
    );
  };
}

import type { ReactNode } from "react";
import WorkProjectLayout from "../components/WorkProjectLayout";

export type WorkProjectMetadata = {
  tag: string;
  summary: string;
  /** List card thumbnail; optional string URL or Vite image module src. */
  cover?: string;
  year?: string;
  role?: string;
};

type CreateWorkPageOptions = {
  metadata: WorkProjectMetadata;
};

export function createWorkPage({ metadata }: CreateWorkPageOptions) {
  const { tag, year, role } = metadata;

  return function WorkMdxPage({ children }: { children?: ReactNode }) {
    return (
      <WorkProjectLayout tag={tag} year={year} role={role}>
        {children}
      </WorkProjectLayout>
    );
  };
}

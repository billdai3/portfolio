import type { ReactNode } from "react";
import WorkProjectLayout from "../components/WorkProjectLayout";

export type WorkProjectMetadata = {
  tag: string;
  summary: string;
  /** List card thumbnail; optional string URL or Vite image module src. */
  cover?: string;
  /** When true, detail body is fetched from the secret repo after unlock. */
  isLocked?: boolean;
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

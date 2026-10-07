import type { ComponentType, ReactNode } from "react";
import LabProjectLayout from "../components/LabProjectLayout";

export type LabProjectMetadata = {
  tag: string;
  summary: string;
  /** List card thumbnail; optional string URL or Vite image module src. */
  cover?: string;
  /** Lower sorts earlier in lists; omit to sort last. */
  order?: number;
};

type CreateLabPageOptions = {
  Sketch: ComponentType;
  metadata: LabProjectMetadata;
};

export function createLabPage({ Sketch }: CreateLabPageOptions) {
  return function LabMdxPage({ children }: { children?: ReactNode }) {
    return (
      <LabProjectLayout demo={<Sketch />}>{children}</LabProjectLayout>
    );
  };
}

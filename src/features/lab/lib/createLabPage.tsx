import type { ComponentType, ReactNode } from "react";
import LabProjectLayout from "../components/LabProjectLayout";

export type LabProjectMetadata = {
  tag: string;
  summary: string;
  /** Lower sorts earlier in lists; omit to sort last. */
  order?: number;
};

type CreateLabPageOptions = {
  Sketch: ComponentType;
  metadata: LabProjectMetadata;
};

export function createLabPage({ Sketch, metadata }: CreateLabPageOptions) {
  const { tag } = metadata;

  return function LabMdxPage({ children }: { children?: ReactNode }) {
    return (
      <LabProjectLayout tag={tag} demo={<Sketch />}>
        {children}
      </LabProjectLayout>
    );
  };
}

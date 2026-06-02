import type { ComponentType, ReactNode } from "react";
import LabProjectLayout from "./LabProjectLayout";

export type LabProjectMetadata = {
  title: string;
  tag: string;
  summary: string;
};

type CreateLabPageOptions = {
  Sketch: ComponentType;
  metadata: LabProjectMetadata;
};

export function createLabPage({ Sketch, metadata }: CreateLabPageOptions) {
  const { title, tag } = metadata;

  return function LabMdxPage({ children }: { children?: ReactNode }) {
    return (
      <LabProjectLayout title={title} tag={tag} demo={<Sketch />}>
        {children}
      </LabProjectLayout>
    );
  };
}

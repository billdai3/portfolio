/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react";
  import type { LabProjectMetadata } from "./features/lab/lib/createLabPage";

  export const metadata: LabProjectMetadata;
  const MDXComponent: ComponentType<{ children?: ReactNode }>;
  export default MDXComponent;
}

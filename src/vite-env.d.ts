/// <reference types="vite/client" />

import type { ComponentType, ReactNode } from "react";
import type { LabProjectMetadata } from "./lab/createLabPage";

declare module "*.mdx" {
  export const metadata: LabProjectMetadata;
  const MDXComponent: ComponentType<{ children?: ReactNode }>;
  export default MDXComponent;
}

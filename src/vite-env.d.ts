/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react";

  export const metadata: Record<string, unknown>;
  export const title: string;
  const MDXComponent: ComponentType<{ children?: ReactNode }>;
  export default MDXComponent;
}

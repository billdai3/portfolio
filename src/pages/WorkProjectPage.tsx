import { MDXProvider } from "@mdx-js/react";
import { Navigate, useParams } from "react-router-dom";
import { workMdxComponents } from "../features/work/components/mdx-components";
import { getWorkProject } from "../features/work/lib/registry";

export default function WorkProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getWorkProject(slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const { Page } = project;

  return (
    <MDXProvider components={workMdxComponents}>
      <Page />
    </MDXProvider>
  );
}

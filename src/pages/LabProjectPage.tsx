import { MDXProvider } from "@mdx-js/react";
import { Navigate, useParams } from "react-router-dom";
import { labMdxComponents } from "../lab/mdx-components";
import { getLabProject } from "../lab/registry";

export default function LabProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getLabProject(slug);

  if (!project) {
    return <Navigate to="/lab" replace />;
  }

  const { Page } = project;

  return (
    <MDXProvider components={labMdxComponents}>
      <Page />
    </MDXProvider>
  );
}

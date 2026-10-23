import { MDXProvider } from "@mdx-js/react";
import { Navigate, useParams } from "react-router-dom";
import { labMdxComponents } from "../features/lab/components/mdx-components";
import { getLabProject } from "../features/lab/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

export default function LabProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getLabProject(slug);

  useDocumentTitle(
    project
      ? formatDocumentTitle(project.title, "Lab")
      : formatDocumentTitle("Lab"),
  );

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

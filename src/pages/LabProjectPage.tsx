import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { labMdxComponents } from "../features/lab/components/mdx-components";
import {
  getLabProject,
  type LabProjectEntry,
} from "../features/lab/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

function LabProjectBody({ project }: { project: LabProjectEntry }) {
  const { LazyPage } = project;

  return (
    <MDXProvider components={labMdxComponents}>
      <Suspense fallback={null}>
        <LazyPage />
      </Suspense>
    </MDXProvider>
  );
}

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

  return <LabProjectBody key={project.slug} project={project} />;
}

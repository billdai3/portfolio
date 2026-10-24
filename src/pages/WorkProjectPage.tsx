import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import LockedWorkProject from "../features/work/components/LockedWorkProject";
import { workMdxComponents } from "../features/work/components/mdx-components";
import {
  getWorkProject,
  type WorkProjectEntry,
} from "../features/work/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

function UnlockedWorkProject({ project }: { project: WorkProjectEntry }) {
  const { LazyPage } = project;

  return (
    <MDXProvider components={workMdxComponents}>
      <Suspense fallback={null}>
        <LazyPage />
      </Suspense>
    </MDXProvider>
  );
}

export default function WorkProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getWorkProject(slug);

  useDocumentTitle(
    project
      ? formatDocumentTitle(project.title, "Work")
      : formatDocumentTitle("Work"),
  );

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  if (project.isLocked) {
    return <LockedWorkProject key={project.slug} slug={project.slug} />;
  }

  return <UnlockedWorkProject key={project.slug} project={project} />;
}

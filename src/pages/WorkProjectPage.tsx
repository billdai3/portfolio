import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
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
import NotFoundPage from "./NotFoundPage";

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

function WorkProjectResolved({ project }: { project: WorkProjectEntry }) {
  useDocumentTitle(formatDocumentTitle(project.title, "Work"));

  if (project.isLocked) {
    return <LockedWorkProject key={project.slug} slug={project.slug} />;
  }

  return <UnlockedWorkProject key={project.slug} project={project} />;
}

export default function WorkProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getWorkProject(slug);

  if (!project) {
    return <NotFoundPage />;
  }

  return <WorkProjectResolved project={project} />;
}

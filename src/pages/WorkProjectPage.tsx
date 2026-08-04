import { MDXProvider } from "@mdx-js/react";
import { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { workMdxComponents } from "../features/work/components/mdx-components";
import { getWorkProject } from "../features/work/lib/registry";

const LockedWorkProject = lazy(
  () => import("../features/work/components/LockedWorkProject"),
);

function LockedFallback() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-text-secondary">
      載入中…
    </div>
  );
}

export default function WorkProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getWorkProject(slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  if (project.isLocked) {
    return (
      <Suspense fallback={<LockedFallback />}>
        <LockedWorkProject slug={project.slug} />
      </Suspense>
    );
  }

  const { Page } = project;

  return (
    <MDXProvider components={workMdxComponents}>
      <Page />
    </MDXProvider>
  );
}

import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { GridIconLoadingBlock } from "../components/GridIconLoading";
import { labMdxComponents } from "../features/lab/components/mdx-components";
import {
  getLabProject,
  type LabProjectEntry,
} from "../features/lab/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";
import NotFoundPage from "./NotFoundPage";

function LabProjectBody({ project }: { project: LabProjectEntry }) {
  const { LazyPage } = project;

  return (
    <MDXProvider components={labMdxComponents}>
      <Suspense fallback={<GridIconLoadingBlock />}>
        <LazyPage />
      </Suspense>
    </MDXProvider>
  );
}

function LabProjectResolved({ project }: { project: LabProjectEntry }) {
  useDocumentTitle(formatDocumentTitle(project.title, "Lab"));

  return <LabProjectBody key={project.slug} project={project} />;
}

export default function LabProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getLabProject(slug);

  if (!project) {
    return <NotFoundPage />;
  }

  return <LabProjectResolved project={project} />;
}

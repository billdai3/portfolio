import PageShell from "../components/PageShell";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { workProjects } from "../features/work/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

export default function WorkPage() {
  useDocumentTitle(formatDocumentTitle("Work"));

  return (
    <PageShell>
      <h1 className="sr-only">Work</h1>
      <ul className="showcase-grid">
        {workProjects.map((project) => (
          <li key={project.slug}>
            <ShowcaseCardDelayed
              item={{
                title: project.title,
                tag: project.tag,
                href: `/work/${project.slug}`,
                from: "/work",
                isLocked: project.isLocked,
              }}
              image={project.cover}
              video={project.coverVideo}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

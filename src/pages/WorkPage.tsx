import PageShell from "../components/PageShell";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { workProjects } from "../features/work/lib/registry";

export default function WorkPage() {
  return (
    <PageShell>
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

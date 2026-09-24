import PageShell from "../components/PageShell";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { workProjects } from "../features/work/lib/registry";

export default function WorkPage() {
  return (
    <PageShell title="Work" description="Selected projects and case studies.">
      <ul className="grid gap-10 sm:grid-cols-2">
        {workProjects.map((project) => (
          <li key={project.slug}>
            <ShowcaseCardDelayed
              item={{
                title: project.title,
                tag: project.tag,
                href: `/work/${project.slug}`,
                isLocked: project.isLocked,
              }}
              image={project.cover}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

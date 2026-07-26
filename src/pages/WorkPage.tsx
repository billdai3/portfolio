import PageShell from "../components/PageShell";
import ShowcaseCard from "../components/ShowcaseCard";
import { workProjects } from "../features/work/lib/registry";

export default function WorkPage() {
  return (
    <PageShell
      title="Work"
      description="Selected projects and case studies."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {workProjects.map((project) => (
          <li key={project.slug}>
            <ShowcaseCard
              item={{
                title: project.title,
                tag: project.tag,
                href: `/work/${project.slug}`,
              }}
              image={project.cover}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

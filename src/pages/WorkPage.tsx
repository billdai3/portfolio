import PageShell from "../components/PageShell";
import ShowcaseCard, { type ShowcaseItem } from "../components/ShowcaseCard";

const placeholderProjects: ShowcaseItem[] = [
  { title: "Project One", tag: "Case study" },
  { title: "Project Two", tag: "Web app" },
  { title: "Project Three", tag: "Branding" },
];

export default function WorkPage() {
  return (
    <PageShell
      title="Work"
      description="Selected projects and case studies. Replace these placeholders with your real work."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {placeholderProjects.map((project) => (
          <li key={project.title}>
            <ShowcaseCard item={project} variant="on-section" />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

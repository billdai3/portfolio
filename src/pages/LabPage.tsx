import PageShell from "../components/PageShell";
import ShowcaseCard from "../components/ShowcaseCard";
import { labProjects } from "../features/lab/lib/registry";

export default function LabPage() {
  return (
    <PageShell
      title="Lab"
      description="Experiments, prototypes, and work-in-progress ideas live here."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {labProjects.map((item) => (
          <li key={item.slug}>
            <ShowcaseCard
              item={{
                title: item.title,
                tag: item.tag,
                href: `/lab/${item.slug}`,
              }}
              variant="on-section"
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

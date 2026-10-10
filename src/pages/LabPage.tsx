import PageShell from "../components/PageShell";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { labProjects } from "../features/lab/lib/registry";

export default function LabPage() {
  return (
    <PageShell
      title="Lab"
      description="Experiments, prototypes, and work-in-progress ideas live here."
    >
      <ul className="showcase-grid">
        {labProjects.map((item) => (
          <li key={item.slug}>
            <ShowcaseCardDelayed
              item={{
                title: item.title,
                tag: item.tag,
                href: `/lab/${item.slug}`,
              }}
              image={item.cover}
              video={item.coverVideo}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

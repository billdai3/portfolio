import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import ShowcaseCard from "../components/ShowcaseCard";
import { labProjects } from "../features/lab/lib/registry";

function LabShowcaseCard({
  title,
  tag,
  href,
}: {
  title: string;
  tag: string;
  href: string;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ShowcaseCard
      item={{ title, tag, href }}
      variant="on-section"
      loading={loading}
    />
  );
}

export default function LabPage() {
  return (
    <PageShell
      title="Lab"
      description="Experiments, prototypes, and work-in-progress ideas live here."
    >
      <ul className="grid gap-6 sm:grid-cols-3">
        {labProjects.map((item) => (
          <li key={item.slug}>
            <LabShowcaseCard
              title={item.title}
              tag={item.tag}
              href={`/lab/${item.slug}`}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

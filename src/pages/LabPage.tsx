import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { labProjects } from "../features/lab/lib/registry";

export default function LabPage() {
  return (
    <PageShell
      title="Lab"
      description="Experiments, prototypes, and work-in-progress ideas live here."
    >
      <ul className="divide-y divide-border-default border-y border-border-default">
        {labProjects.map((item) => (
          <li key={item.slug}>
            <Link
              to={`/lab/${item.slug}`}
              className="group flex items-baseline justify-between gap-4 py-5 transition"
            >
              <span className="font-medium text-text-primary group-hover:text-accent">
                {item.title}
              </span>
              <span className="text-sm text-text-muted">{item.tag}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

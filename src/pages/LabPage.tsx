import PageShell from "../components/PageShell";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { labProjects } from "../features/lab/lib/registry";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

export default function LabPage() {
  useDocumentTitle(formatDocumentTitle("Lab"));

  return (
    <PageShell>
      <ul className="showcase-grid">
        {labProjects.map((item) => (
          <li key={item.slug}>
            <ShowcaseCardDelayed
              item={{
                title: item.title,
                tag: item.tag,
                href: `/lab/${item.slug}`,
                from: "/lab",
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

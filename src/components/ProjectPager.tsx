import { Link, useParams } from "react-router-dom";
import {
  getProjectNeighbors,
  type ProjectNavTarget,
  type ProjectSection,
} from "@/features/projects/lib/project-neighbors";
import ArrowIcon from "./icons/ArrowIcon";

type ProjectPagerProps = {
  section: ProjectSection;
};

const linkClassName =
  "type-btn inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-bg-card px-6 py-4 text-text-primary transition-colors duration-300 ease-out hover:bg-brand hover:text-ash-900 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

function targetLabel(target: ProjectNavTarget, side: "prev" | "next") {
  if (target.kind === "home") return "Home";
  return side === "prev" ? "Previous" : "Next";
}

export default function ProjectPager({ section }: ProjectPagerProps) {
  const { slug } = useParams<{ slug: string }>();
  const neighbors = getProjectNeighbors(section, slug);

  if (!neighbors) return null;

  const { prev, next } = neighbors;

  return (
    <nav
      aria-label="Project navigation"
      className="mt-16 flex gap-3 sm:mt-20 sm:gap-4"
    >
      <Link to={prev.href} className={linkClassName}>
        <ArrowIcon direction="left" className="size-4 shrink-0" />
        <span>{targetLabel(prev, "prev")}</span>
      </Link>
      <Link to={next.href} className={linkClassName}>
        <span>{targetLabel(next, "next")}</span>
        <ArrowIcon direction="right" className="size-4 shrink-0" />
      </Link>
    </nav>
  );
}

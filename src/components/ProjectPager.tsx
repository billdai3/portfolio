import { Link, useLocation, useParams } from "react-router-dom";
import {
  getProjectNeighbors,
  type ProjectNavTarget,
  type ProjectSection,
} from "@/features/projects/lib/project-neighbors";
import {
  getDetailFrom,
  toDetailLocationState,
} from "@/features/projects/lib/detail-from";
import ArrowIcon from "./icons/ArrowIcon";

type ProjectPagerProps = {
  section: ProjectSection;
};

const linkClassName =
  "group type-btn inline-flex flex-1 items-center justify-center rounded-xl bg-bg-card px-6 py-4 text-text-primary transition-colors duration-300 ease-out hover:bg-bg-section-alt focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

const iconWrapClassName =
  "inline-flex w-0 overflow-hidden opacity-0 transition-[width,opacity,margin] duration-300 ease-out motion-reduce:transition-none group-hover:w-4 group-hover:opacity-100 group-focus-visible:w-4 group-focus-visible:opacity-100";

function targetLabel(target: ProjectNavTarget, side: "prev" | "next") {
  if (target.kind === "home") return "Home";
  return side === "prev" ? "Previous" : "Next";
}

export default function ProjectPager({ section }: ProjectPagerProps) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const neighbors = getProjectNeighbors(section, slug);
  const linkState = toDetailLocationState(getDetailFrom(location.state));

  if (!neighbors) return null;

  const { prev, next } = neighbors;

  return (
    <nav
      aria-label="Project navigation"
      className="mt-16 flex gap-3 sm:mt-20 sm:gap-4"
    >
      <Link
        to={prev.href}
        state={linkState}
        replace
        className={linkClassName}
      >
        <span
          className={`${iconWrapClassName} group-hover:mr-1 group-focus-visible:mr-1`}
          aria-hidden
        >
          <ArrowIcon direction="left" className="size-4 shrink-0" />
        </span>
        <span>{targetLabel(prev, "prev")}</span>
      </Link>
      <Link
        to={next.href}
        state={linkState}
        replace
        className={linkClassName}
      >
        <span>{targetLabel(next, "next")}</span>
        <span
          className={`${iconWrapClassName} group-hover:ml-1 group-focus-visible:ml-1`}
          aria-hidden
        >
          <ArrowIcon direction="right" className="size-4 shrink-0" />
        </span>
      </Link>
    </nav>
  );
}

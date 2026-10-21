import { type ReactNode } from "react";
import DetailBackButton from "@/components/DetailBackButton";
import ProjectPager from "@/components/ProjectPager";

type WorkProjectLayoutProps = {
  children: ReactNode;
  /** When false, skip article/work-prose (e.g. unlock form). Defaults to true. */
  prose?: boolean;
  /** When false, hide Previous/Next (e.g. while locked content loads). Defaults to true. */
  showPager?: boolean;
};

export default function WorkProjectLayout({
  children,
  prose = true,
  showPager = true,
}: WorkProjectLayoutProps) {
  return (
    <div className="bg-bg-page text-text-primary">
      <DetailBackButton fallbackTo="/work" />

      <div className="mx-auto max-w-360 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
        {prose ? (
          <article className="work-prose lab-prose max-w-none">
            {children}
          </article>
        ) : (
          children
        )}
        {showPager ? <ProjectPager section="work" /> : null}
      </div>
    </div>
  );
}

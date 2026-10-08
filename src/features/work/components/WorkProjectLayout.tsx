import { type ReactNode } from "react";
import DetailBackButton from "@/components/DetailBackButton";

type WorkProjectLayoutProps = {
  children: ReactNode;
  /** When false, skip article/work-prose (e.g. unlock form). Defaults to true. */
  prose?: boolean;
};

export default function WorkProjectLayout({
  children,
  prose = true,
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
      </div>
    </div>
  );
}

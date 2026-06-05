import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type LabProjectLayoutProps = {
  title: string;
  tag?: string;
  demo: ReactNode;
  children: ReactNode;
};

type MobileTab = "demo" | "article";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "type-btn flex-1 rounded-full px-4 py-2.5 transition-colors",
        active
          ? "bg-accent text-ash-900"
          : "text-text-secondary hover:text-text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function LabProjectLayout({
  title,
  tag,
  demo,
  children,
}: LabProjectLayoutProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("demo");

  const demoPanel = (
    <div className="flex h-full min-h-[min(70svh,32rem)] flex-col lg:min-h-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-card p-3 sm:p-4">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-ash-900">
          {demo}
        </div>
      </div>
    </div>
  );

  const articlePanel = (
    <article className="lab-prose max-w-none">{children}</article>
  );

  return (
    <div className="bg-bg-page text-text-primary">
      <div className="mx-auto max-w-360 px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <header className="mb-6 lg:mb-8">
          <Link
            to="/lab"
            className="type-btn inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text-primary"
          >
            <span aria-hidden>←</span> Lab
          </Link>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <h1 className="type-page-title">{title}</h1>
            {tag ? (
              <span className="type-btn rounded-full border border-border-default px-3 py-1 text-xs text-text-secondary">
                {tag}
              </span>
            ) : null}
          </div>
        </header>

        <div className="mb-4 lg:hidden">
          <div
            role="tablist"
            aria-label="Lab project sections"
            className="flex gap-1 rounded-full border border-border-default bg-bg-card p-1"
          >
            <TabButton
              active={mobileTab === "demo"}
              onClick={() => setMobileTab("demo")}
            >
              互動展示
            </TabButton>
            <TabButton
              active={mobileTab === "article"}
              onClick={() => setMobileTab("article")}
            >
              技術文章
            </TabButton>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <aside
            className={[
              "lg:sticky lg:top-24 lg:self-start",
              "lg:h-[calc(100svh-7rem)]",
              mobileTab === "demo" ? "block" : "hidden lg:block",
            ].join(" ")}
            aria-label="Interactive demo"
          >
            {demoPanel}
          </aside>

          <div
            className={[
              "min-w-0",
              mobileTab === "article" ? "block" : "hidden lg:block",
            ].join(" ")}
          >
            {articlePanel}
          </div>
        </div>
      </div>
    </div>
  );
}

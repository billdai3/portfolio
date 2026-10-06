import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type LabProjectLayoutProps = {
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

function GoBackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/lab");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="detail-back-btn"
      aria-label="Go Back"
    >
      <span className="detail-back-btn__icon" aria-hidden>
        ←
      </span>
      <span className="detail-back-btn__label">Go Back</span>
    </button>
  );
}

export default function LabProjectLayout({
  demo,
  children,
}: LabProjectLayoutProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("demo");

  const demoPanel = (
    <div className="flex h-full min-h-[min(70svh,32rem)] flex-col lg:min-h-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-card">
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
      <GoBackButton />

      <div className="mx-auto max-w-360 px-2 pb-16 pt-14 sm:px-4 lg:px-6 lg:pb-20 lg:pt-18">
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
              "lg:sticky lg:top-14 lg:self-start",
              "lg:h-[calc(100svh-4.5rem)]",
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

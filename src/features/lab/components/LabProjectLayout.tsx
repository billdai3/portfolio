import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import DetailBackButton from "@/components/DetailBackButton";

type LabProjectLayoutProps = {
  demo: ReactNode;
  children: ReactNode;
};

type MobileTab = "demo" | "article";

type IndicatorState = {
  left: number;
  width: number;
  ready: boolean;
};

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
        "type-btn relative z-10 flex-1 rounded-xl px-4 py-2.5 transition-colors",
        active
          ? "text-text-primary"
          : "text-text-secondary hover:text-text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function LabProjectLayout({
  demo,
  children,
}: LabProjectLayoutProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("demo");
  const tablistRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;

    const activeTab = tablist.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    );
    if (!activeTab) return;

    const tablistRect = tablist.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - tablistRect.left,
      width: tabRect.width,
      ready: true,
    });
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
    const frame = requestAnimationFrame(() => updateIndicator());
    return () => cancelAnimationFrame(frame);
  }, [mobileTab, updateIndicator]);

  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;

    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });

    resizeObserver.observe(tablist);
    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const demoPanel = (
    <div className="flex h-full min-h-[calc(100svh-9rem)] flex-col lg:min-h-0">
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
      <DetailBackButton fallbackTo="/lab" />

      <div className="mx-auto max-w-360 px-2 pt-16 sm:px-4 lg:px-6">
        <div className="mb-3 lg:hidden">
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Lab project sections"
            className="relative flex gap-1 rounded-2xl bg-bg-card p-1.5"
          >
            <div
              aria-hidden
              className={[
                "pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl bg-bg-section-alt",
                "transition-[left,width,opacity] duration-300 ease-out",
                "motion-reduce:transition-none",
                indicator.ready ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />
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

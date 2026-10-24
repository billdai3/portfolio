import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import DetailBackButton from "@/components/DetailBackButton";
import ProjectPager from "@/components/ProjectPager";

type LabProjectLayoutProps = {
  /** Interactive demo pane; omit for article-only (image-heavy) lab projects. */
  demo?: ReactNode;
  children: ReactNode;
};

type MobileTab = "demo" | "article";

const TABS: { id: MobileTab; tabId: string; panelId: string; label: string }[] =
  [
    {
      id: "demo",
      tabId: "lab-tab-demo",
      panelId: "lab-panel-demo",
      label: "互動展示",
    },
    {
      id: "article",
      tabId: "lab-tab-article",
      panelId: "lab-panel-article",
      label: "技術文章",
    },
  ];

type IndicatorState = {
  left: number;
  width: number;
  ready: boolean;
};

function TabButton({
  id,
  controls,
  active,
  onClick,
  buttonRef,
  children,
}: {
  id: string;
  controls: string;
  active: boolean;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
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

function LabProjectLayoutWithDemo({
  demo,
  children,
}: {
  demo: ReactNode;
  children: ReactNode;
}) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("demo");
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false,
  });

  const selectTab = useCallback((tab: MobileTab, focus = false) => {
    setMobileTab(tab);
    if (!focus) return;
    const index = TABS.findIndex((item) => item.id === tab);
    tabRefs.current[index]?.focus();
  }, []);

  const onTabListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = TABS.findIndex((tab) => tab.id === mobileTab);
      if (currentIndex < 0) return;

      let nextIndex: number | null = null;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % TABS.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      selectTab(TABS[nextIndex].id, true);
    },
    [mobileTab, selectTab],
  );

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

      <div className="mx-auto max-w-360 px-2 pb-16 pt-16 sm:px-4 lg:px-6 lg:pb-20">
        <div className="mb-3 lg:hidden">
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Lab project sections"
            onKeyDown={onTabListKeyDown}
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
            {TABS.map((tab, index) => (
              <TabButton
                key={tab.id}
                id={tab.tabId}
                controls={tab.panelId}
                active={mobileTab === tab.id}
                onClick={() => selectTab(tab.id)}
                buttonRef={(node) => {
                  tabRefs.current[index] = node;
                }}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <aside
            id="lab-panel-demo"
            role="tabpanel"
            aria-labelledby="lab-tab-demo"
            className={[
              "lg:sticky lg:top-14 lg:self-start",
              "lg:h-[calc(100svh-4.5rem)]",
              mobileTab === "demo" ? "block" : "hidden lg:block",
            ].join(" ")}
          >
            {demoPanel}
          </aside>

          <div
            id="lab-panel-article"
            role="tabpanel"
            aria-labelledby="lab-tab-article"
            className={[
              "min-w-0",
              mobileTab === "article" ? "block" : "hidden lg:block",
            ].join(" ")}
          >
            {articlePanel}
          </div>
        </div>

        <ProjectPager section="lab" />
      </div>
    </div>
  );
}

export default function LabProjectLayout({
  demo,
  children,
}: LabProjectLayoutProps) {
  if (!demo) {
    return (
      <div className="bg-bg-page text-text-primary">
        <DetailBackButton fallbackTo="/lab" />

        <div className="mx-auto max-w-360 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
          <article className="work-prose lab-prose max-w-none">
            {children}
          </article>
          <ProjectPager section="lab" />
        </div>
      </div>
    );
  }

  return (
    <LabProjectLayoutWithDemo demo={demo}>{children}</LabProjectLayoutWithDemo>
  );
}

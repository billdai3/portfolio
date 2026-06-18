import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { devPages } from "@/config/dev-pages";

const SCROLL_THRESHOLD = 8;
const TOP_REVEAL_OFFSET = 16;

const navItems = [
  { to: "/", label: "Bill's", end: true, isHome: true },
  { to: "/work", label: "Work", isHome: false },
  { to: "/lab", label: "Lab", isHome: false },
  { to: "/about", label: "About", isHome: false },
] as const;

type NavVisualTheme = "over-hero" | "scrolled";

type IndicatorState = {
  left: number;
  width: number;
  ready: boolean;
};

function isLabProjectPath(pathname: string) {
  return /^\/lab\/[^/]+$/.test(pathname);
}

function subscribeNavOverHero(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getNavOverHeroSnapshot(
  isHome: boolean,
  navRef: RefObject<HTMLElement | null>,
) {
  if (!isHome) return false;

  const hero = document.getElementById("home-hero");
  const nav = navRef.current;
  if (!hero || !nav) return true;

  const heroRect = hero.getBoundingClientRect();
  const navBottom = nav.getBoundingClientRect().bottom;
  return heroRect.bottom > navBottom;
}

function subscribeCanHover(onStoreChange: () => void) {
  const media = window.matchMedia("(hover: hover)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getCanHoverSnapshot() {
  return window.matchMedia("(hover: hover)").matches;
}

function useNavOverHero(
  isHome: boolean,
  navRef: RefObject<HTMLElement | null>,
) {
  return useSyncExternalStore(
    subscribeNavOverHero,
    () => getNavOverHeroSnapshot(isHome, navRef),
    () => isHome,
  );
}

function useCanHover() {
  return useSyncExternalStore(
    subscribeCanHover,
    getCanHoverSnapshot,
    () => true,
  );
}

function LabNavShell({
  expanded,
  canHover,
  pillWidth,
  tabWidth,
  onCollapsedClick,
  onHoverEnter,
  children,
}: {
  expanded: boolean;
  canHover: boolean;
  pillWidth: number;
  tabWidth: number;
  onCollapsedClick: () => void;
  onHoverEnter: () => void;
  children: ReactNode;
}) {
  const shellStyle = {
    ...(pillWidth > 0 ? { "--nav-pill-width": `${pillWidth}px` } : {}),
    ...(tabWidth > 0 ? { "--nav-tab-width": `${tabWidth}px` } : {}),
  } as CSSProperties;

  return (
    <div
      className={[
        "nav-lab-shell",
        expanded ? "nav-lab-shell--expanded" : "",
      ].join(" ")}
      style={shellStyle}
    >
      <div
        className="nav-lab-shell__bars nav-collapsed-tab"
        aria-hidden={expanded}
        onMouseEnter={canHover && !expanded ? onHoverEnter : undefined}
      >
        {!canHover ? (
          <button
            type="button"
            className="nav-lab-shell__hit"
            aria-label="展開導航"
            aria-expanded={expanded}
            onClick={onCollapsedClick}
          />
        ) : null}
        <span className="nav-collapsed-tab__bar" />
        <span className="nav-collapsed-tab__bar" />
      </div>

      <div
        className={[
          "nav-lab-shell__nav",
          expanded ? "nav-lab-shell__nav--visible" : "",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLabProject = isLabProjectPath(location.pathname);
  const hidePrimaryNav =
    import.meta.env.DEV && location.pathname === "/dev/gsap";
  const canHover = useCanHover();
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navVisible, setNavVisible] = useState(true);
  const [navExpanded, setNavExpanded] = useState(false);
  const navOverHero = useNavOverHero(isHome, navRef);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false,
  });
  const [pillWidth, setPillWidth] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const pillMeasureRef = useRef<HTMLDivElement>(null);
  const tabMeasureRef = useRef<HTMLDivElement>(null);
  const labInteractiveRef = useRef<HTMLDivElement>(null);

  const navTheme: NavVisualTheme =
    isHome && navOverHero ? "over-hero" : "scrolled";

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const activeLink = nav.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      ready: true,
    });
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
    const frame = requestAnimationFrame(() => updateIndicator());
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, navTheme, navExpanded, updateIndicator]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });

    resizeObserver.observe(nav);
    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  useLayoutEffect(() => {
    if (!isLabProject) return;

    const measureRoot = pillMeasureRef.current;
    if (!measureRoot) return;

    const nav = measureRoot.querySelector<HTMLElement>("nav");
    if (!nav) return;

    const measurePill = () => setPillWidth(nav.offsetWidth);
    measurePill();

    const resizeObserver = new ResizeObserver(measurePill);
    resizeObserver.observe(nav);
    window.addEventListener("resize", measurePill);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measurePill);
    };
  }, [isLabProject, location.pathname, navTheme]);

  useLayoutEffect(() => {
    if (!isLabProject) return;

    const tab = tabMeasureRef.current?.firstElementChild;
    if (!tab) return;

    const measureTab = () => setTabWidth(tab.getBoundingClientRect().width);
    measureTab();

    const resizeObserver = new ResizeObserver(measureTab);
    resizeObserver.observe(tab);
    window.addEventListener("resize", measureTab);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureTab);
    };
  }, [isLabProject]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const frame = requestAnimationFrame(() => {
      setNavVisible(true);
      setNavExpanded(false);
      lastScrollY.current = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    if (isLabProject) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    lastScrollY.current = window.scrollY;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= TOP_REVEAL_OFFSET) {
          setNavVisible(true);
        } else if (delta > SCROLL_THRESHOLD) {
          setNavVisible(false);
        } else if (delta < -SCROLL_THRESHOLD) {
          setNavVisible(true);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLabProject]);

  const handleLabNavEnter = () => {
    if (canHover) setNavExpanded(true);
  };

  const handleLabNavLeave = (event: MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;

    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) return;

    const interactive = labInteractiveRef.current;
    requestAnimationFrame(() => {
      if (!interactive?.matches(":hover")) {
        setNavExpanded(false);
      }
    });
  };

  const handleCollapsedTabClick = () => {
    if (!canHover) setNavExpanded((prev) => !prev);
  };

  const renderNavPill = (options?: {
    ref?: RefObject<HTMLElement | null>;
    measure?: boolean;
  }) => (
    <nav
      ref={options?.ref}
      className={[
        "nav-pill",
        isLabProject || navTheme === "scrolled"
          ? "nav-pill--scrolled"
          : "nav-pill--over-hero",
      ].join(" ")}
      aria-label={options?.measure ? undefined : "Primary"}
    >
      {options?.measure ? null : (
        <div
          aria-hidden
          className={[
            "nav-pill__indicator",
            indicator.ready ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
        />
      )}

      {navItems.map(({ to, label, isHome: isHomeLink, ...rest }) => (
        <NavLink
          key={to}
          to={to}
          data-home={isHomeLink ? "true" : "false"}
          className="nav-pill__link type-nav"
          tabIndex={options?.measure ? -1 : undefined}
          {...rest}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-svh flex-col">
      {hidePrimaryNav ? null : isLabProject ? (
        <div className="nav-lab-host">
          <div
            ref={labInteractiveRef}
            className={[
              "nav-lab-interactive",
              navExpanded ? "nav-lab-interactive--expanded" : "",
            ].join(" ")}
            onMouseLeave={canHover ? handleLabNavLeave : undefined}
          >
            <div className="nav-lab-stage">
              <LabNavShell
                expanded={navExpanded}
                canHover={canHover}
                pillWidth={pillWidth}
                tabWidth={tabWidth}
                onCollapsedClick={handleCollapsedTabClick}
                onHoverEnter={handleLabNavEnter}
              >
                {renderNavPill({ ref: navRef })}
              </LabNavShell>
            </div>
          </div>

          <div ref={pillMeasureRef} className="nav-lab-measure" aria-hidden>
            {renderNavPill({ measure: true })}
          </div>

          <div ref={tabMeasureRef} className="nav-lab-measure" aria-hidden>
            <div className="nav-collapsed-tab">
              <span className="nav-collapsed-tab__bar" />
              <span className="nav-collapsed-tab__bar" />
            </div>
          </div>
        </div>
      ) : (
        <header
          className={[
            "fixed top-0 right-0 left-0 z-50 px-4 pt-6 pb-2 transition-transform duration-300 ease-out sm:px-6",
            navVisible ? "translate-y-0" : "-translate-y-full",
          ].join(" ")}
        >
          <div className="mx-auto flex max-w-6xl justify-center">
            {renderNavPill({ ref: navRef })}
          </div>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-text-muted">
          {import.meta.env.DEV ? (
            <nav
              aria-label="Dev pages"
              className="mb-3 flex flex-wrap gap-x-4 gap-y-1"
            >
              {devPages.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="transition-colors hover:text-text-primary"
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          ) : null}
          © {new Date().getFullYear()} Your Name
        </div>
      </footer>
    </div>
  );
}

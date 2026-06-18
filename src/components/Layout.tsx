import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
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

function NavCollapsedTab({
  expanded,
  canHover,
  onClick,
  onHoverEnter,
}: {
  expanded: boolean;
  canHover: boolean;
  onClick: () => void;
  onHoverEnter: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        "nav-collapsed-tab",
        expanded ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="展開導航"
      aria-expanded={expanded}
      onClick={onClick}
      onMouseEnter={canHover && !expanded ? onHoverEnter : undefined}
    >
      <span className="nav-collapsed-tab__bar" />
      <span className="nav-collapsed-tab__bar" />
    </button>
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

  const handleLabNavLeave = () => {
    if (canHover) setNavExpanded(false);
  };

  const handleCollapsedTabClick = () => {
    if (!canHover) setNavExpanded((prev) => !prev);
  };

  const navPill = (
    <nav
      ref={navRef}
      className={[
        "nav-pill",
        isLabProject || navTheme === "scrolled"
          ? "nav-pill--scrolled"
          : "nav-pill--over-hero",
      ].join(" ")}
      aria-label="Primary"
    >
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

      {navItems.map(({ to, label, isHome: isHomeLink, ...rest }) => (
        <NavLink
          key={to}
          to={to}
          data-home={isHomeLink ? "true" : "false"}
          className="nav-pill__link type-nav"
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
            className={[
              "nav-lab-interactive",
              navExpanded ? "nav-lab-interactive--expanded" : "",
            ].join(" ")}
            onMouseLeave={canHover ? handleLabNavLeave : undefined}
          >
            <NavCollapsedTab
              expanded={navExpanded}
              canHover={canHover}
              onClick={handleCollapsedTabClick}
              onHoverEnter={handleLabNavEnter}
            />

            <div
              className={[
                "flex justify-center px-4 pb-2 transition-all duration-200 ease-out sm:px-6",
                navExpanded
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none h-0 overflow-hidden opacity-0",
              ].join(" ")}
            >
              {navPill}
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
          <div className="mx-auto flex max-w-6xl justify-center">{navPill}</div>
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

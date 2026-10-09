import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SVGProps,
} from "react";
import { Mail } from "lucide-react";
import { NavLink, useLocation, useOutlet } from "react-router-dom";
import GithubIcon from "./icons/GithubIcon";
import RouteTransitionOutlet from "./RouteTransitionOutlet";

const SCROLL_THRESHOLD = 8;
const TOP_REVEAL_OFFSET = 16;

type FooterIcon = ComponentType<
  SVGProps<SVGSVGElement> & { strokeWidth?: number }
>;

/** Placeholder URLs — replace with real contact links later. */
const footerLinks: { href: string; label: string; Icon: FooterIcon }[] = [
  {
    href: "mailto:twbilldai@gmail.com",
    label: "Email",
    Icon: Mail,
  },
  {
    href: "https://github.com/billdai3",
    label: "GitHub",
    Icon: GithubIcon,
  },
];

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

function isDetailPagePath(pathname: string) {
  return /^\/(lab|work)\/[^/]+$/.test(pathname);
}

function isEnteringDetail(prev: string, next: string) {
  return !isDetailPagePath(prev) && isDetailPagePath(next);
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

function DetailNavShell({
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
        "nav-detail-shell",
        expanded ? "nav-detail-shell--expanded" : "",
      ].join(" ")}
      style={shellStyle}
    >
      <div
        className="nav-detail-shell__bars nav-collapsed-tab"
        aria-hidden={expanded}
        onMouseEnter={canHover && !expanded ? onHoverEnter : undefined}
      >
        {!canHover ? (
          <button
            type="button"
            className="nav-detail-shell__hit"
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
          "nav-detail-shell__nav",
          expanded ? "nav-detail-shell__nav--visible" : "",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const isHome = location.pathname === "/";
  const isDetailPage = isDetailPagePath(location.pathname);
  const hidePrimaryNav =
    import.meta.env.DEV && location.pathname === "/dev/gsap";
  const canHover = useCanHover();
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navVisible, setNavVisible] = useState(true);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [navExpanded, setNavExpanded] = useState(
    () => !isDetailPagePath(location.pathname),
  );
  const navOverHero = useNavOverHero(isHome, navRef);
  const [entryCollapsePending, setEntryCollapsePending] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false,
  });
  const [pillWidth, setPillWidth] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const pillMeasureRef = useRef<HTMLDivElement>(null);
  const tabMeasureRef = useRef<HTMLDivElement>(null);
  const detailNavInteractiveRef = useRef<HTMLDivElement>(null);

  const navTheme: NavVisualTheme =
    isHome && navOverHero ? "over-hero" : "scrolled";

  if (location.pathname !== prevPathname) {
    const nextPath = location.pathname;
    const enteringDetail = isEnteringDetail(prevPathname, nextPath);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setPrevPathname(nextPath);

    if (isDetailPagePath(nextPath)) {
      if (enteringDetail && !reducedMotion) {
        setEntryCollapsePending(true);
      } else {
        setNavExpanded(false);
        setEntryCollapsePending(false);
      }
    } else {
      setEntryCollapsePending(false);
    }
  }

  const shellExpanded = isDetailPage
    ? entryCollapsePending || navExpanded
    : true;

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
  }, [location.pathname, navTheme, shellExpanded, updateIndicator]);

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
  }, [location.pathname, navTheme]);

  useLayoutEffect(() => {
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
  }, []);

  useLayoutEffect(() => {
    if (!entryCollapsePending) return;
    if (pillWidth <= 0 || tabWidth <= 0) return;

    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setNavExpanded(false);
        setEntryCollapsePending(false);
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      if (frame2) cancelAnimationFrame(frame2);
    };
  }, [entryCollapsePending, pillWidth, tabWidth]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    lastScrollY.current = 0;

    const frame = requestAnimationFrame(() => setNavVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    if (isDetailPage) return;

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
  }, [isDetailPage]);

  const handleDetailNavEnter = () => {
    if (isDetailPage && canHover) setNavExpanded(true);
  };

  const handleDetailNavLeave = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDetailPage || !canHover) return;

    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related))
      return;

    const interactive = detailNavInteractiveRef.current;
    requestAnimationFrame(() => {
      if (!interactive?.matches(":hover")) {
        setNavExpanded(false);
      }
    });
  };

  const handleCollapsedTabClick = () => {
    if (isDetailPage && !canHover) setNavExpanded((prev) => !prev);
  };

  const renderNavPill = (options?: {
    ref?: RefObject<HTMLElement | null>;
    measure?: boolean;
  }) => (
    <nav
      ref={options?.ref}
      className={[
        "nav-pill",
        isDetailPage || navTheme === "scrolled"
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
      {hidePrimaryNav ? null : (
        <div
          className={[
            "nav-detail-host",
            !isDetailPage ? "nav-detail-host--list" : "",
            !isDetailPage
              ? navVisible
                ? "translate-y-0"
                : "-translate-y-full"
              : "",
          ].join(" ")}
        >
          <div
            ref={detailNavInteractiveRef}
            className={[
              "nav-detail-interactive",
              shellExpanded ? "nav-detail-interactive--expanded" : "",
            ].join(" ")}
            onMouseLeave={
              isDetailPage && canHover ? handleDetailNavLeave : undefined
            }
          >
            <div className="nav-detail-stage">
              <DetailNavShell
                expanded={shellExpanded}
                canHover={isDetailPage && canHover}
                pillWidth={pillWidth}
                tabWidth={tabWidth}
                onCollapsedClick={handleCollapsedTabClick}
                onHoverEnter={handleDetailNavEnter}
              >
                {renderNavPill({ ref: navRef })}
              </DetailNavShell>
            </div>
          </div>

          <div ref={pillMeasureRef} className="nav-detail-measure" aria-hidden>
            {renderNavPill({ measure: true })}
          </div>

          <div ref={tabMeasureRef} className="nav-detail-measure" aria-hidden>
            <div className="nav-collapsed-tab">
              <span className="nav-collapsed-tab__bar" />
              <span className="nav-collapsed-tab__bar" />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <RouteTransitionOutlet pathname={location.pathname}>
          {outlet}
        </RouteTransitionOutlet>
      </main>

      <footer>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 py-10 text-md text-text-secondary">
          <nav
            aria-label="Contact"
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            {footerLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="transition-colors hover:text-brand"
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <Icon className="size-6" aria-hidden strokeWidth={1.75} />
              </a>
            ))}
          </nav>

          <p className="shrink-0 whitespace-nowrap">
            © {new Date().getFullYear()} Bill Dai
          </p>
        </div>
      </footer>
    </div>
  );
}

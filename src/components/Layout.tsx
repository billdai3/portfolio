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

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hidePrimaryNav =
    import.meta.env.DEV && location.pathname === "/dev/gsap";
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navVisible, setNavVisible] = useState(true);
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
  }, [location.pathname, navTheme, updateIndicator]);

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
      lastScrollY.current = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      {hidePrimaryNav ? null : (
        <header
          className={[
            "fixed top-0 right-0 left-0 z-50 px-4 pt-6 pb-2 transition-transform duration-300 ease-out sm:px-6",
            navVisible ? "translate-y-0" : "-translate-y-full",
          ].join(" ")}
        >
          <div className="mx-auto flex max-w-6xl justify-center">
            <nav
              ref={navRef}
              className={[
                "nav-pill",
                navTheme === "over-hero"
                  ? "nav-pill--over-hero"
                  : "nav-pill--scrolled",
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
          </div>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-text-muted">
          © {new Date().getFullYear()} Your Name
        </div>
      </footer>
    </div>
  );
}

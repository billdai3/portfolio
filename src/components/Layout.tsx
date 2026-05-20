import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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

type IndicatorState = {
  left: number;
  width: number;
  isHome: boolean;
  ready: boolean;
};

function pillNavLinkClass(isHome: boolean) {
  return ({ isActive }: { isActive: boolean }) => {
    const base =
      "type-nav relative z-10 rounded-full px-4 py-2 transition-colors duration-300";

    if (!isActive) {
      return [base, "text-text-primary hover:bg-ash-100"].join(" ");
    }

    if (isHome) {
      return [base, "text-text-primary"].join(" ");
    }

    return [base, "text-white"].join(" ");
  };
}

export default function Layout() {
  const location = useLocation();
  const hidePrimaryNav =
    import.meta.env.DEV && location.pathname === "/dev/gsap";
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navVisible, setNavVisible] = useState(true);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    isHome: true,
    ready: false,
  });

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
      isHome: activeLink.dataset.home === "true",
      ready: true,
    });
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
    const frame = requestAnimationFrame(() => updateIndicator());
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, updateIndicator]);

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
    const frame = requestAnimationFrame(() => {
      setNavVisible(true);
      lastScrollY.current = window.scrollY;
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
              className="relative inline-flex items-center rounded-full bg-white p-1.5 shadow-md"
              aria-label="Primary"
            >
              <div
                aria-hidden
                className={[
                  "pointer-events-none absolute top-1.5 bottom-1.5 rounded-full transition-[left,width,background-color] duration-300 ease-out",
                  indicator.isHome ? "bg-accent" : "bg-ash-900",
                  indicator.ready ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  left: indicator.left,
                  width: indicator.width,
                }}
              />

              {navItems.map(({ to, label, isHome, ...rest }) => (
                <NavLink
                  key={to}
                  to={to}
                  data-home={isHome ? "true" : "false"}
                  className={pillNavLinkClass(isHome)}
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

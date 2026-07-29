import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RoutePageType = "immersive" | "list" | "detail" | "content" | "none";
type RouteTransitionKind = "subtle" | "emphasized";

type RouteTransitionProfile = {
  enabled: boolean;
  durationMs: number;
  enter: boolean;
  exit: boolean;
  kind: RouteTransitionKind;
};

type RouteTransitionOutletProps = {
  pathname: string;
  children: ReactNode;
};

const DEFAULT_PROFILE: RouteTransitionProfile = {
  enabled: false,
  durationMs: 0,
  enter: false,
  exit: false,
  kind: "subtle",
};

function getPageType(pathname: string): RoutePageType {
  if (pathname === "/") return "immersive";
  if (pathname === "/work" || pathname === "/lab") return "list";
  if (/^\/(work|lab)\/[^/]+$/.test(pathname)) return "detail";
  if (pathname === "/about") return "content";
  if (pathname.startsWith("/dev/")) return "none";
  return "content";
}

function getTransitionProfile(
  fromPath: string,
  toPath: string,
): RouteTransitionProfile {
  if (fromPath === toPath) return DEFAULT_PROFILE;

  const fromType = getPageType(fromPath);
  const toType = getPageType(toPath);

  if (fromType === "none" || toType === "none") return DEFAULT_PROFILE;

  if (fromType === "immersive" || toType === "immersive") {
    return {
      enabled: true,
      durationMs: 120,
      enter: true,
      exit: true,
      kind: "subtle",
    };
  }

  if (fromType === "list" && toType === "detail") {
    return {
      enabled: true,
      durationMs: 200,
      enter: false,
      exit: true,
      kind: "emphasized",
    };
  }

  if (fromType === "detail" && toType === "list") {
    return {
      enabled: true,
      durationMs: 180,
      enter: true,
      exit: true,
      kind: "subtle",
    };
  }

  if (toType === "detail") {
    return {
      enabled: true,
      durationMs: 140,
      enter: false,
      exit: true,
      kind: "subtle",
    };
  }

  return {
    enabled: true,
    durationMs: 140,
    enter: true,
    exit: true,
    kind: "subtle",
  };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

export default function RouteTransitionOutlet({
  pathname,
  children,
}: RouteTransitionOutletProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activePath, setActivePath] = useState(pathname);
  const [activeChildren, setActiveChildren] = useState(children);
  const [exitingLayer, setExitingLayer] = useState<{
    path: string;
    children: ReactNode;
    profile: RouteTransitionProfile;
  } | null>(null);
  const [enterProfile, setEnterProfile] =
    useState<RouteTransitionProfile>(DEFAULT_PROFILE);
  const clearTimerRef = useRef<number | null>(null);

  // Adjust state during render when props change (React-recommended pattern)
  if (pathname === activePath) {
    if (activeChildren !== children) {
      setActiveChildren(children);
    }
  } else {
    const profile = getTransitionProfile(activePath, pathname);

    if (prefersReducedMotion || !profile.enabled) {
      setActivePath(pathname);
      setActiveChildren(children);
      setExitingLayer(null);
      setEnterProfile(DEFAULT_PROFILE);
    } else {
      setExitingLayer({
        path: activePath,
        children: activeChildren,
        profile,
      });
      setActivePath(pathname);
      setActiveChildren(children);
      setEnterProfile(profile);
    }
  }

  useEffect(() => {
    if (exitingLayer === null) return;

    clearTimerRef.current = window.setTimeout(() => {
      setExitingLayer(null);
      setEnterProfile(DEFAULT_PROFILE);
      clearTimerRef.current = null;
    }, exitingLayer.profile.durationMs);

    return () => {
      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
    };
  }, [exitingLayer]);

  const activePageType = useMemo(() => getPageType(activePath), [activePath]);
  const activeStyle = {
    "--page-transition-duration": `${enterProfile.durationMs}ms`,
  } as CSSProperties;

  return (
    <div className="page-transition-stage">
      {exitingLayer?.profile.exit ? (
        <div
          key={`exit:${exitingLayer.path}`}
          className={[
            "page-transition-layer",
            "page-transition-layer--exit",
            `page-transition-layer--${exitingLayer.profile.kind}`,
          ].join(" ")}
          data-page-type={getPageType(exitingLayer.path)}
          style={
            {
              "--page-transition-duration": `${exitingLayer.profile.durationMs}ms`,
            } as CSSProperties
          }
        >
          {exitingLayer.children}
        </div>
      ) : null}

      <div
        key={activePath}
        className={[
          "page-transition-layer",
          enterProfile.enter ? "page-transition-layer--enter" : "",
          `page-transition-layer--${enterProfile.kind}`,
        ].join(" ")}
        data-page-type={activePageType}
        style={activeStyle}
      >
        {activeChildren}
      </div>
    </div>
  );
}

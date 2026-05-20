import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

import iconGridSvg from "../assets/icon-grid.svg?raw";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type CircleTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  /** 回到起點並從頭播放。 */
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type HeroAnimationProps = {
  className?: string;
  /** 由時間軸 `onUpdate` 同步到 Leva 的 `progress`（0–1）。 */
  levaSetValues?: LevaSetValues;
  /** 掛上後可 `seek` / `restart`（dev + Leva）。 */
  circleTimelineRef?: MutableRefObject<CircleTimelineHandle | null>;
};

/** 圓圈描邊 0–1.08s */
const CIRCLE_DRAW_TOTAL_SEC = 1.08;
const CIRCLE_EASE = "power2.inOut";

/** 由內到外 */
const CIRCLE_DRAW_ORDER = ["line-cir-3", "line-cir-2", "line-cir-1"] as const;

/** 垂直線 0.9–1.4s（0.5s），依序 */
const VERT_START_SEC = 0.9;
const VERT_DRAW_TOTAL_SEC = 0.5;
const VERT_EASE = "none";

const VERT_DRAW_CONFIG = [
  { id: "line-vert-1", growFrom: "top" as const },
  { id: "line-vert-2", growFrom: "bottom" as const },
  { id: "line-vert-3", growFrom: "top" as const },
];

function queryCirclePaths(graphic: Element): SVGPathElement[] {
  const paths: SVGPathElement[] = [];
  for (const id of CIRCLE_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) paths.push(p);
  }
  return paths;
}

function resetCircleDash(paths: SVGPathElement[], lengths: number[]) {
  paths.forEach((p, i) => {
    gsap.set(p, {
      strokeDasharray: lengths[i],
      strokeDashoffset: -lengths[i],
    });
  });
}

/** 垂直線 path 為 Mx 512V0；由上往下時改為 Mx 0V512 */
function ensureVertPathDirection(
  path: SVGPathElement,
  growFrom: "top" | "bottom",
): void {
  const d = path.getAttribute("d") ?? "";
  const bottomToTop = /^M([\d.]+)\s+512\s*V\s*0\s*$/i.test(d.trim());
  const topToBottom = /^M([\d.]+)\s+0\s*V\s*512\s*$/i.test(d.trim());

  if (growFrom === "top" && bottomToTop) {
    const x = d.match(/^M([\d.]+)/)?.[1];
    if (x) path.setAttribute("d", `M${x} 0V512`);
  } else if (growFrom === "bottom" && topToBottom) {
    const x = d.match(/^M([\d.]+)/)?.[1];
    if (x) path.setAttribute("d", `M${x} 512V0`);
  }
}

function setVertLineHidden(
  path: SVGPathElement,
  growFrom: "top" | "bottom",
): number {
  ensureVertPathDirection(path, growFrom);
  const len = path.getTotalLength();
  // path 起點在「長出來」的那一端：offset len→0 沿 path 方向畫出
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: len,
  });
  return len;
}

function resetVertLines(graphic: Element) {
  for (const { id, growFrom } of VERT_DRAW_CONFIG) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setVertLineHidden(p, growFrom);
  }
}

function showPathsComplete(paths: SVGPathElement[]) {
  for (const p of paths) {
    gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 });
  }
}

function buildHeroTimeline(
  graphic: Element,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const circlePaths = queryCirclePaths(graphic);
  const circleSegmentSec = CIRCLE_DRAW_TOTAL_SEC / CIRCLE_DRAW_ORDER.length;
  const vertSegmentSec = VERT_DRAW_TOTAL_SEC / VERT_DRAW_CONFIG.length;

  const tl = gsap.timeline({
    defaults: { ease: CIRCLE_EASE },
  });

  tl.call(() => resetVertLines(graphic), undefined, 0);

  if (circlePaths.length !== CIRCLE_DRAW_ORDER.length) {
    if (import.meta.env.DEV) {
      console.warn(
        "[HeroAnimation] Expected circle paths",
        CIRCLE_DRAW_ORDER,
        "inside #graphic",
      );
    }
  } else {
    const circleLengths = circlePaths.map((p) => p.getTotalLength());

    tl.call(
      () => resetCircleDash(circlePaths, circleLengths),
      undefined,
      0,
    );

    for (let i = 0; i < circlePaths.length; i++) {
      tl.to(
        circlePaths[i],
        {
          strokeDashoffset: 0,
          duration: circleSegmentSec,
          ease: CIRCLE_EASE,
        },
        i === 0 ? 0 : ">",
      );
    }
  }

  const vertPaths: SVGPathElement[] = [];
  for (const { id } of VERT_DRAW_CONFIG) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) vertPaths.push(p);
  }

  if (vertPaths.length !== VERT_DRAW_CONFIG.length) {
    if (import.meta.env.DEV) {
      console.warn(
        "[HeroAnimation] Expected vert paths",
        VERT_DRAW_CONFIG.map((c) => c.id),
        "inside #graphic",
      );
    }
  } else {
    tl.call(() => resetVertLines(graphic), undefined, VERT_START_SEC);

    for (const { id } of VERT_DRAW_CONFIG) {
      const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`)!;
      const isFirst =
        VERT_DRAW_CONFIG.findIndex((c) => c.id === id) === 0;

      tl.to(
        p,
        {
          strokeDashoffset: 0,
          duration: vertSegmentSec,
          ease: VERT_EASE,
        },
        isFirst ? VERT_START_SEC : ">",
      );
    }
  }

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

export default function HeroAnimation({
  className,
  levaSetValues,
  circleTimelineRef,
}: HeroAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const svg = root.querySelector("svg");
    if (!svg) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const graphic = svg.querySelector("#graphic");
    if (!graphic) {
      if (import.meta.env.DEV) {
        console.warn("[HeroAnimation] Missing #graphic in icon-grid.svg");
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showPathsComplete(queryCirclePaths(graphic));
        for (const { id } of VERT_DRAW_CONFIG) {
          const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
          if (p) showPathsComplete([p]);
        }
        if (circleTimelineRef) {
          circleTimelineRef.current = null;
        }
        return;
      }

      const tl = buildHeroTimeline(graphic, levaSetValues);

      tlRef.current = tl;

      if (circleTimelineRef) {
        circleTimelineRef.current = {
          seek: (progress: number) => {
            const t = tlRef.current;
            if (!t) return;
            const p = Math.max(0, Math.min(1, progress));
            t.pause();
            t.progress(p);
          },
          getProgress: () => tlRef.current?.progress() ?? 0,
          restart: () => {
            const t = tlRef.current;
            if (!t) return;
            t.pause();
            t.progress(0);
            levaSetValues?.({ progress: 0 });
            t.play();
          },
        };
      }

      levaSetValues?.({ progress: 0 });
      tl.progress(0);
      tl.play();
    }, svg);

    return () => {
      if (circleTimelineRef) {
        circleTimelineRef.current = null;
      }
      tlRef.current = null;
      ctx.revert();
    };
  }, [levaSetValues, circleTimelineRef]);

  return (
    <div
      ref={wrapRef}
      className={[
        "[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: iconGridSvg }}
    />
  );
}

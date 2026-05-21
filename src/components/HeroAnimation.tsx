import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import iconGridSvg from "../assets/icon-grid.svg?raw";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type GridIconTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  /** 回到起點並從頭播放。 */
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type HeroAnimationProps = {
  className?: string;
  levaSetValues?: LevaSetValues;
  gridIconTimelineRef?: RefObject<GridIconTimelineHandle | null>;
};

/** 圓圈 0–1.08s */
const CIRCLE_DRAW_TOTAL_SEC = 1.08;
const CIRCLE_EASE = "power2.inOut";
const CIRCLE_DRAW_ORDER = ["line-cir-3", "line-cir-2", "line-cir-1"] as const;

/** 垂直線 0.9–1.4s */
const VERT_START_SEC = 0.9;
const VERT_DRAW_TOTAL_SEC = 0.5;
const VERT_EASE = "none";
const VERT_DRAW_CONFIG = [
  { id: "line-vert-1", growFrom: "top" as const },
  { id: "line-vert-2", growFrom: "bottom" as const },
  { id: "line-vert-3", growFrom: "top" as const },
];

/** 水平線 1.08–1.58s */
const HOR_START_SEC = 1.08;
const HOR_DRAW_TOTAL_SEC = 0.5;
const HOR_EASE = "none";
const HOR_DRAW_ORDER = ["line-hor-1", "line-hor-2", "line-hor-3"] as const;
const HOR_GROW: Record<(typeof HOR_DRAW_ORDER)[number], "left" | "right"> = {
  "line-hor-1": "left",
  "line-hor-2": "right",
  "line-hor-3": "left",
};

/** 矩形描邊 1.08–2s */
const RECT_START_SEC = 1.08;
const RECT_DRAW_TOTAL_SEC = 0.92;
const RECT_EASE = "power1.in";
const RECT_DRAW_ORDER = ["line-rect", "line-rounded-rect"] as const;

/** 交叉線 1.25–1.75s */
const CROSS_START_SEC = 1.25;
const CROSS_DRAW_TOTAL_SEC = 0.5;
const CROSS_EASE = "none";
const CROSS_DRAW_ORDER = ["line-cross-1", "line-cross-2"] as const;
const CROSS_GROW: Record<(typeof CROSS_DRAW_ORDER)[number], "tr-bl" | "br-tl"> = {
  "line-cross-1": "tr-bl",
  "line-cross-2": "br-tl",
};

/** 背景 1.8–2s */
const BG_START_SEC = 1.8;
const BG_DURATION_SEC = 0.2;
const BG_EASE = "power1.inOut";

function queryPaths(graphic: Element, ids: readonly string[]): SVGPathElement[] {
  const paths: SVGPathElement[] = [];
  for (const id of ids) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) paths.push(p);
  }
  return paths;
}

function setStrokeHidden(path: SVGPathElement, offset: number) {
  const len = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: offset,
  });
  return len;
}

function resetCircleDash(paths: SVGPathElement[], lengths: number[]) {
  paths.forEach((p, i) => {
    gsap.set(p, {
      strokeDasharray: lengths[i],
      strokeDashoffset: -lengths[i],
    });
  });
}

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

function setVertLineHidden(path: SVGPathElement, growFrom: "top" | "bottom") {
  ensureVertPathDirection(path, growFrom);
  setStrokeHidden(path, path.getTotalLength());
}

function ensureHorPathDirection(
  path: SVGPathElement,
  growFrom: "left" | "right",
): void {
  const d = path.getAttribute("d") ?? "";
  const leftToRight = /^M0\s+([\d.]+)\s*H\s*512\s*$/i.test(d.trim());
  const rightToLeft = /^M512\s+([\d.]+)\s*H\s*0\s*$/i.test(d.trim());
  const y = d.match(/M(?:0|512)\s+([\d.]+)/)?.[1];

  if (!y) return;

  if (growFrom === "left" && !leftToRight) {
    path.setAttribute("d", `M0 ${y}H512`);
  } else if (growFrom === "right" && !rightToLeft) {
    path.setAttribute("d", `M512 ${y}H0`);
  }
}

function setHorLineHidden(path: SVGPathElement, growFrom: "left" | "right") {
  ensureHorPathDirection(path, growFrom);
  setStrokeHidden(path, path.getTotalLength());
}

/** 方形 path 改為順時針：上→右→下→左 */
function ensureRectClockwise(path: SVGPathElement): void {
  if (path.getAttribute("id") === "line-rect") {
    path.setAttribute("d", "M35 35H477V477H35V35Z");
  }
}

function setRectStrokeHidden(path: SVGPathElement) {
  ensureRectClockwise(path);
  const len = path.getTotalLength();
  const initialOffset = path.getAttribute("id") === "line-rect" ? len : -len;
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: initialOffset,
  });
}

function ensureCrossPathDirection(
  path: SVGPathElement,
  grow: "tr-bl" | "br-tl",
): void {
  const d = path.getAttribute("d") ?? "";
  if (grow === "tr-bl") {
    const trToBl = /^M478\s+34\s*L\s*34\s+478\s*$/i.test(d.trim());
    const blToTr = /^M34\s+478\s*L\s*478\s+34\s*$/i.test(d.trim());
    if (blToTr) path.setAttribute("d", "M478 34L34 478");
    else if (!trToBl) path.setAttribute("d", "M478 34L34 478");
  } else {
    const brToTl = /^M478\s+478\s*L\s*34\s+34\s*$/i.test(d.trim());
    const tlToBr = /^M34\s+34\s*L\s*478\s+478\s*$/i.test(d.trim());
    if (tlToBr) path.setAttribute("d", "M478 478L34 34");
    else if (!brToTl) path.setAttribute("d", "M478 478L34 34");
  }
}

function setCrossLineHidden(path: SVGPathElement, grow: "tr-bl" | "br-tl") {
  ensureCrossPathDirection(path, grow);
  setStrokeHidden(path, path.getTotalLength());
}

function resetAllHidden(graphic: Element) {
  for (const { id, growFrom } of VERT_DRAW_CONFIG) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setVertLineHidden(p, growFrom);
  }
  for (const id of HOR_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setHorLineHidden(p, HOR_GROW[id]);
  }
  for (const id of RECT_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setRectStrokeHidden(p);
  }
  for (const id of CROSS_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setCrossLineHidden(p, CROSS_GROW[id]);
  }
  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (bg) gsap.set(bg, { opacity: 0 });
}

function showPathsComplete(paths: SVGPathElement[]) {
  for (const p of paths) {
    gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 });
  }
}

function addSequentialStrokeTweens(
  tl: gsap.core.Timeline,
  paths: SVGPathElement[],
  startSec: number,
  totalSec: number,
  ease: string,
  endOffset = 0,
) {
  if (paths.length === 0) return;
  const segmentSec = totalSec / paths.length;
  for (let i = 0; i < paths.length; i++) {
    tl.to(
      paths[i],
      {
        strokeDashoffset: endOffset,
        duration: segmentSec,
        ease,
      },
      i === 0 ? startSec : ">",
    );
  }
}

function buildHeroTimeline(
  graphic: Element,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: CIRCLE_EASE } });

  tl.call(() => resetAllHidden(graphic), undefined, 0);

  const circlePaths = queryPaths(graphic, CIRCLE_DRAW_ORDER);
  if (circlePaths.length === CIRCLE_DRAW_ORDER.length) {
    const circleLengths = circlePaths.map((p) => p.getTotalLength());
    tl.call(() => resetCircleDash(circlePaths, circleLengths), undefined, 0);
    addSequentialStrokeTweens(
      tl,
      circlePaths,
      0,
      CIRCLE_DRAW_TOTAL_SEC,
      CIRCLE_EASE,
      0,
    );
  } else if (import.meta.env.DEV) {
    console.warn("[HeroAnimation] Missing circle paths");
  }

  const vertPaths = queryPaths(
    graphic,
    VERT_DRAW_CONFIG.map((c) => c.id),
  );
  if (vertPaths.length === VERT_DRAW_CONFIG.length) {
    tl.call(() => {
      for (const { id, growFrom } of VERT_DRAW_CONFIG) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setVertLineHidden(p, growFrom);
      }
    }, undefined, VERT_START_SEC);
    addSequentialStrokeTweens(
      tl,
      vertPaths,
      VERT_START_SEC,
      VERT_DRAW_TOTAL_SEC,
      VERT_EASE,
      0,
    );
  } else if (import.meta.env.DEV) {
    console.warn("[HeroAnimation] Missing vert paths");
  }

  const horPaths = queryPaths(graphic, HOR_DRAW_ORDER);
  if (horPaths.length === HOR_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of HOR_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setHorLineHidden(p, HOR_GROW[id]);
      }
    }, undefined, HOR_START_SEC);
    addSequentialStrokeTweens(
      tl,
      horPaths,
      HOR_START_SEC,
      HOR_DRAW_TOTAL_SEC,
      HOR_EASE,
      0,
    );
  } else if (import.meta.env.DEV) {
    console.warn("[HeroAnimation] Missing hor paths");
  }

  const rectPaths = queryPaths(graphic, RECT_DRAW_ORDER);
  if (rectPaths.length === RECT_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of RECT_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setRectStrokeHidden(p);
      }
    }, undefined, RECT_START_SEC);
    addSequentialStrokeTweens(
      tl,
      rectPaths,
      RECT_START_SEC,
      RECT_DRAW_TOTAL_SEC,
      RECT_EASE,
      0,
    );
  } else if (import.meta.env.DEV) {
    console.warn("[HeroAnimation] Missing rect paths");
  }

  const crossPaths = queryPaths(graphic, CROSS_DRAW_ORDER);
  if (crossPaths.length === CROSS_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of CROSS_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setCrossLineHidden(p, CROSS_GROW[id]);
      }
    }, undefined, CROSS_START_SEC);
    addSequentialStrokeTweens(
      tl,
      crossPaths,
      CROSS_START_SEC,
      CROSS_DRAW_TOTAL_SEC,
      CROSS_EASE,
      0,
    );
  } else if (import.meta.env.DEV) {
    console.warn("[HeroAnimation] Missing cross paths");
  }

  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (bg) {
    tl.fromTo(
      bg,
      { opacity: 0 },
      { opacity: 1, duration: BG_DURATION_SEC, ease: BG_EASE },
      BG_START_SEC,
    );
  }

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

function showGraphicComplete(graphic: Element) {
  const strokeIds = [
    ...CIRCLE_DRAW_ORDER,
    ...VERT_DRAW_CONFIG.map((c) => c.id),
    ...HOR_DRAW_ORDER,
    ...RECT_DRAW_ORDER,
    ...CROSS_DRAW_ORDER,
  ];
  showPathsComplete(queryPaths(graphic, strokeIds));
  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (bg) gsap.set(bg, { opacity: 1 });
}

export default function HeroAnimation({
  className,
  levaSetValues,
  gridIconTimelineRef,
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
        showGraphicComplete(graphic);
        if (gridIconTimelineRef) {
          gridIconTimelineRef.current = null;
        }
        return;
      }

      const tl = buildHeroTimeline(graphic, levaSetValues);

      tlRef.current = tl;

      if (gridIconTimelineRef) {
        gridIconTimelineRef.current = {
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
      if (gridIconTimelineRef) {
        gridIconTimelineRef.current = null;
      }
      tlRef.current = null;
      ctx.revert();
    };
  }, [levaSetValues, gridIconTimelineRef]);

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

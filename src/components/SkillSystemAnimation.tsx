import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import skillSystemSvg from "../assets/skill-system.svg?raw";

const TIMELINE_DURATION_SEC = 4.4;
const SVG_ORIGIN = "80 80";
const SYM_EASE = "power1.out";
const SYM_DUR = 0.3;
const ANIM_END_SEC = 2.8;

const SYMBOL_PART_IDS = [
  "symbol-t-out",
  "symbol-r-out",
  "symbol-b-out",
  "symbol-l-out",
  "symbol-t-in",
  "symbol-r-in",
  "symbol-b-in",
  "symbol-l-in",
] as const;

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillSystemTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type SkillSystemAnimationProps = {
  className?: string;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillSystemTimelineHandle | null>;
};

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function symbolParts(root: ParentNode): SVGElement[] {
  return SYMBOL_PART_IDS.map((id) => q<SVGElement>(root, id)).filter(
    (el): el is SVGElement => el != null,
  );
}

function buildSkillSystemTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const donutCover = q<SVGElement>(root, "donut-cover");
  const donutIn = q<SVGCircleElement>(root, "donut-in");
  const donutOut20 = q<SVGElement>(root, "donut-out-20");
  const donutOut40 = q<SVGElement>(root, "donut-out-40");
  const donutOut60 = q<SVGElement>(root, "donut-out-60");
  const donutOut80 = q<SVGElement>(root, "donut-out-80");
  const parts = symbolParts(root);
  const symbolTOut = q<SVGRectElement>(root, "symbol-t-out");
  const symbolROut = q<SVGRectElement>(root, "symbol-r-out");
  const symbolBOut = q<SVGRectElement>(root, "symbol-b-out");
  const symbolLOut = q<SVGRectElement>(root, "symbol-l-out");
  const symbolTIn = q<SVGRectElement>(root, "symbol-t-in");
  const symbolRIn = q<SVGRectElement>(root, "symbol-r-in");
  const symbolBIn = q<SVGRectElement>(root, "symbol-b-in");
  const symbolLIn = q<SVGRectElement>(root, "symbol-l-in");

  const tl = gsap.timeline({ repeat: -1 });
  const symMove = { duration: SYM_DUR, ease: SYM_EASE };

  if (donutCover) tl.set(donutCover, { autoAlpha: 0 }, 0);

  if (parts.length > 0) {
    tl.to(
      parts,
      {
        rotation: "+=45",
        svgOrigin: SVG_ORIGIN,
        duration: SYM_DUR,
        ease: SYM_EASE,
      },
      0.5,
    );
  }

  if (symbolTOut) {
    tl.to(symbolTOut, { y: "+=5", ...symMove }, 1.1);
  }
  if (symbolROut) {
    tl.to(symbolROut, { x: "+=-5", ...symMove }, 1.1);
  }
  if (symbolBOut) {
    tl.to(symbolBOut, { y: "+=-5", ...symMove }, 1.1);
  }
  if (symbolLOut) {
    tl.to(symbolLOut, { x: "+=5", ...symMove }, 1.1);
  }
  if (symbolTIn) {
    tl.to(symbolTIn, { y: "+=5", height: "-=15", ...symMove }, 1.1);
  }
  if (symbolRIn) {
    tl.to(symbolRIn, { x: "+=10", width: "-=15", ...symMove }, 1.1);
  }
  if (symbolBIn) {
    tl.to(symbolBIn, { y: "+=10", height: "-=15", ...symMove }, 1.1);
  }
  if (symbolLIn) {
    tl.to(symbolLIn, { x: "+=5", width: "-=15", ...symMove }, 1.1);
  }
  if (donutIn) {
    tl.to(donutIn, { attr: { r: 61 }, ...symMove }, 1.1);
  }

  if (donutCover) tl.set(donutCover, { autoAlpha: 1 }, 1.4);
  if (donutOut20) {
    tl.set(donutOut20, { rotation: -72, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut40) {
    tl.set(donutOut40, { rotation: -144, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut60) {
    tl.set(donutOut60, { rotation: -216, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut80) {
    tl.set(donutOut80, { rotation: -288, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (parts.length > 0) {
    tl.to(
      parts,
      {
        rotation: "+=45",
        svgOrigin: SVG_ORIGIN,
        duration: SYM_DUR,
        ease: SYM_EASE,
      },
      2,
    );
  }

  if (symbolTOut) {
    tl.to(symbolTOut, { x: "+=3.5355", y: "+=-3.5355", ...symMove }, 2.5);
  }
  if (symbolROut) {
    tl.to(symbolROut, { x: "+=3.5355", y: "+=3.5355", ...symMove }, 2.5);
  }
  if (symbolBOut) {
    tl.to(symbolBOut, { x: "+=-3.5355", y: "+=3.5355", ...symMove }, 2.5);
  }
  if (symbolLOut) {
    tl.to(symbolLOut, { x: "+=-3.5355", y: "+=-3.5355", ...symMove }, 2.5);
  }
  tl.to({}, { duration: TIMELINE_DURATION_SEC - ANIM_END_SEC }, ANIM_END_SEC);

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

function showCompleteState(root: ParentNode) {
  const tl = buildSkillSystemTimeline(root);
  tl.time(ANIM_END_SEC);
  tl.kill();
}

export default function SkillSystemAnimation({
  className,
  levaSetValues,
  timelineRef,
}: SkillSystemAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector("#skill-system") ?? svg;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showCompleteState(scene);
        if (timelineRef) timelineRef.current = null;
        return;
      }

      const tl = buildSkillSystemTimeline(scene, levaSetValues);
      tlRef.current = tl;

      if (timelineRef) {
        timelineRef.current = {
          seek: (progress: number) => {
            const t = tlRef.current;
            if (!t) return;
            t.pause();
            t.progress(Math.max(0, Math.min(1, progress)));
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
      if (timelineRef) timelineRef.current = null;
      tlRef.current = null;
      ctx.revert();
    };
  }, [levaSetValues, timelineRef]);

  return (
    <div
      ref={wrapRef}
      className={[
        "[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: skillSystemSvg }}
    />
  );
}

import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import skillDesignSvg from "../assets/skill-design.svg?raw";

const TIMELINE_DURATION_SEC = 4.4;

/** <g> 群組：SVG 已對齊箭頭前座標，只補相對位移（目標 − 起點）。 */
const CURSOR_DX_1 = 104 - 58;
const CURSOR_DY_1 = 88 - 50;
const CURSOR_DX_2 = 12 - 104;
const CURSOR_DY_2 = 12 - 88;
const CURSOR_DX_3 = 104 - 12;
const CURSOR_DY_3 = 88 - 12;
const CURSOR_DX_4 = 58 - 104;
const CURSOR_DY_4 = 50 - 88;

const SIZE_DX_1 = 6 - 52;
const SIZE_DY_1 = 58 - 124;
const SIZE_DX_2 = 52 - 6;
const SIZE_DY_2 = 124 - 58;

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillDesignTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type SkillDesignAnimationProps = {
  className?: string;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillDesignTimelineHandle | null>;
};

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function buildSkillDesignTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const cursor = q<SVGGElement>(root, "cursor");
  const cursorArrow = q<SVGElement>(root, "cursor-arrow");
  const cursorResize = q<SVGElement>(root, "cursor-resize");
  const cursorTarget = q<SVGElement>(root, "cursor-target");
  const surface = q<SVGRectElement>(root, "surface");
  const vertexTl = q<SVGRectElement>(root, "vertex-tl");
  const vertexTr = q<SVGRectElement>(root, "vertex-tr");
  const vertexBr = q<SVGRectElement>(root, "vertex-br");
  const vertexBl = q<SVGRectElement>(root, "vertex-bl");
  const size = q<SVGGElement>(root, "size");

  const tl = gsap.timeline({ repeat: -1 });

  if (cursorArrow) gsap.set(cursorArrow, { autoAlpha: 1 });
  if (cursorResize) gsap.set(cursorResize, { autoAlpha: 0 });
  if (cursorTarget) gsap.set(cursorTarget, { autoAlpha: 0 });

  if (cursor) {
    tl.to(
      cursor,
      {
        x: `+=${CURSOR_DX_1}`,
        y: `+=${CURSOR_DY_1}`,
        duration: 0.5,
        ease: "power2.out",
      },
      0.5,
    );
  }

  if (cursorResize) tl.set(cursorResize, { autoAlpha: 1 }, 1);
  if (cursorArrow) tl.set(cursorArrow, { autoAlpha: 0 }, 1);

  if (cursor) {
    tl.to(
      cursor,
      {
        x: `+=${CURSOR_DX_2}`,
        y: `+=${CURSOR_DY_2}`,
        duration: 0.3,
        ease: "power1.out",
      },
      1.2,
    );
  }
  if (vertexTr) {
    tl.to(
      vertexTr,
      { attr: { x: 26, y: 26 }, duration: 0.3, ease: "power1.out" },
      1.2,
    );
  }
  if (vertexBr) {
    tl.to(
      vertexBr,
      { attr: { x: 26, y: 26 }, duration: 0.3, ease: "power1.out" },
      1.2,
    );
  }
  if (vertexBl) {
    tl.to(
      vertexBl,
      { attr: { x: 26, y: 26 }, duration: 0.3, ease: "power1.out" },
      1.2,
    );
  }
  if (surface) {
    tl.to(
      surface,
      { attr: { width: 4, height: 4 }, duration: 0.3, ease: "power1.out" },
      1.2,
    );
  }
  if (size) {
    tl.to(
      size,
      {
        x: `+=${SIZE_DX_1}`,
        y: `+=${SIZE_DY_1}`,
        duration: 0.3,
        ease: "power1.out",
      },
      1.2,
    );
  }

  if (cursorArrow) tl.set(cursorArrow, { autoAlpha: 1 }, 1.5);
  if (cursorResize) tl.set(cursorResize, { autoAlpha: 0 }, 1.5);
  if (vertexTl) tl.set(vertexTl, { autoAlpha: 0 }, 1.5);
  if (vertexTr) tl.set(vertexTr, { autoAlpha: 0 }, 1.5);
  if (vertexBr) tl.set(vertexBr, { autoAlpha: 0 }, 1.5);
  if (vertexBl) tl.set(vertexBl, { autoAlpha: 0 }, 1.5);
  if (surface) tl.set(surface, { autoAlpha: 0 }, 1.5);
  if (size) tl.set(size, { autoAlpha: 0 }, 1.5);

  if (cursorTarget) tl.set(cursorTarget, { autoAlpha: 1 }, 2.7);
  if (cursorArrow) tl.set(cursorArrow, { autoAlpha: 0 }, 2.7);
  if (cursor) {
    tl.to(
      cursor,
      {
        x: `+=${CURSOR_DX_3}`,
        y: `+=${CURSOR_DY_3}`,
        duration: 0.3,
        ease: "power1.out",
      },
      2.7,
    );
  }
  if (vertexTl) tl.set(vertexTl, { autoAlpha: 1 }, 2.7);
  if (vertexTr) {
    tl.set(vertexTr, { autoAlpha: 1 }, 2.7);
    tl.to(
      vertexTr,
      { attr: { x: 118, y: 26 }, duration: 0.3, ease: "power1.out" },
      2.7,
    );
  }
  if (vertexBr) {
    tl.set(vertexBr, { autoAlpha: 1 }, 2.7);
    tl.to(
      vertexBr,
      { attr: { x: 118, y: 102 }, duration: 0.3, ease: "power1.out" },
      2.7,
    );
  }
  if (vertexBl) {
    tl.set(vertexBl, { autoAlpha: 1 }, 2.7);
    tl.to(
      vertexBl,
      { attr: { x: 26, y: 102 }, duration: 0.3, ease: "power1.out" },
      2.7,
    );
  }
  if (surface) {
    tl.set(surface, { autoAlpha: 1 }, 2.7);
    tl.to(
      surface,
      { attr: { width: 92, height: 76 }, duration: 0.3, ease: "power1.out" },
      2.7,
    );
  }
  if (size) {
    tl.set(size, { autoAlpha: 1 }, 2.7);
    tl.to(
      size,
      {
        x: `+=${SIZE_DX_2}`,
        y: `+=${SIZE_DY_2}`,
        duration: 0.3,
        ease: "power1.out",
      },
      2.7,
    );
  }

  if (cursorArrow) tl.set(cursorArrow, { autoAlpha: 1 }, 3.2);
  if (cursorTarget) tl.set(cursorTarget, { autoAlpha: 0 }, 3.2);
  if (cursor) {
    tl.to(
      cursor,
      {
        x: `+=${CURSOR_DX_4}`,
        y: `+=${CURSOR_DY_4}`,
        duration: 0.5,
        ease: "power2.inOut",
      },
      3.2,
    );
  }

  tl.to({}, { duration: TIMELINE_DURATION_SEC - 3.7 }, 3.7);

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

function showCompleteState(root: ParentNode) {
  const cursor = q<SVGGElement>(root, "cursor");
  const cursorArrow = q<SVGElement>(root, "cursor-arrow");
  const cursorResize = q<SVGElement>(root, "cursor-resize");
  const cursorTarget = q<SVGElement>(root, "cursor-target");
  const surface = q<SVGRectElement>(root, "surface");
  const vertexTl = q<SVGRectElement>(root, "vertex-tl");
  const vertexTr = q<SVGRectElement>(root, "vertex-tr");
  const vertexBr = q<SVGRectElement>(root, "vertex-br");
  const vertexBl = q<SVGRectElement>(root, "vertex-bl");
  const size = q<SVGGElement>(root, "size");

  if (cursor) gsap.set(cursor, { clearProps: "transform" });
  if (cursorArrow) gsap.set(cursorArrow, { autoAlpha: 1 });
  if (cursorResize) gsap.set(cursorResize, { autoAlpha: 0 });
  if (cursorTarget) gsap.set(cursorTarget, { autoAlpha: 0 });
  if (vertexTl) gsap.set(vertexTl, { autoAlpha: 1, attr: { x: 26, y: 26 } });
  if (vertexTr) gsap.set(vertexTr, { autoAlpha: 1, attr: { x: 118, y: 26 } });
  if (vertexBr) gsap.set(vertexBr, { autoAlpha: 1, attr: { x: 118, y: 102 } });
  if (vertexBl) gsap.set(vertexBl, { autoAlpha: 1, attr: { x: 26, y: 102 } });
  if (surface) {
    gsap.set(surface, { autoAlpha: 1, attr: { width: 92, height: 76 } });
  }
  if (size) gsap.set(size, { autoAlpha: 1, clearProps: "transform" });
}

export default function SkillDesignAnimation({
  className,
  levaSetValues,
  timelineRef,
}: SkillDesignAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector("#skill-design") ?? svg;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showCompleteState(scene);
        if (timelineRef) timelineRef.current = null;
        return;
      }

      const tl = buildSkillDesignTimeline(scene, levaSetValues);
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
      dangerouslySetInnerHTML={{ __html: skillDesignSvg }}
    />
  );
}

import gsap from "gsap";
import type { RefObject } from "react";

import skillDesignSvg from "../assets/skills/skill-design.svg?raw";
import {
  skillSvgClassName,
  useSkillSvgAnimation,
  type SkillLevaSetValues,
  type SkillTimelineHandle,
} from "./useSkillSvgAnimation";

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
export type SkillDesignTimelineHandle = SkillTimelineHandle;

type LevaSetValues = SkillLevaSetValues;

type SkillDesignAnimationProps = {
  className?: string;
  autoplay?: boolean;
  active?: boolean;
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

  applyIdleState(root);

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

/** 動畫 t=0／預設 idle 的絕對休息態。 */
function applyIdleState(root: ParentNode) {
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

  if (cursor) gsap.set(cursor, { x: 0, y: 0 });
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
  if (size) gsap.set(size, { x: 0, y: 0, autoAlpha: 1 });
}

function showCompleteState(root: ParentNode) {
  applyIdleState(root);
}

/** Hover out：從當前值直接過渡回 t=0 休息態。 */
function tweenToRestState(
  root: ParentNode,
  options?: { duration?: number; onComplete?: () => void },
) {
  const duration = options?.duration ?? 0.35;
  const ease = "power2.out";
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

  const rest = gsap.timeline({ onComplete: options?.onComplete });
  if (cursor) rest.to(cursor, { x: 0, y: 0, duration, ease, overwrite: "auto" }, 0);
  if (cursorArrow) {
    rest.to(cursorArrow, { autoAlpha: 1, duration, ease, overwrite: "auto" }, 0);
  }
  if (cursorResize) {
    rest.to(cursorResize, { autoAlpha: 0, duration, ease, overwrite: "auto" }, 0);
  }
  if (cursorTarget) {
    rest.to(cursorTarget, { autoAlpha: 0, duration, ease, overwrite: "auto" }, 0);
  }
  if (vertexTl) {
    rest.to(
      vertexTl,
      { autoAlpha: 1, attr: { x: 26, y: 26 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (vertexTr) {
    rest.to(
      vertexTr,
      { autoAlpha: 1, attr: { x: 118, y: 26 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (vertexBr) {
    rest.to(
      vertexBr,
      { autoAlpha: 1, attr: { x: 118, y: 102 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (vertexBl) {
    rest.to(
      vertexBl,
      { autoAlpha: 1, attr: { x: 26, y: 102 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (surface) {
    rest.to(
      surface,
      {
        autoAlpha: 1,
        attr: { width: 92, height: 76 },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (size) {
    rest.to(
      size,
      { x: 0, y: 0, autoAlpha: 1, duration, ease, overwrite: "auto" },
      0,
    );
  }
  return rest;
}

export default function SkillDesignAnimation({
  className,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: SkillDesignAnimationProps) {
  const wrapRef = useSkillSvgAnimation({
    svgHtml: skillDesignSvg,
    sceneSelector: "#skill-design",
    buildTimeline: buildSkillDesignTimeline,
    showCompleteState,
    applyIdleState,
    tweenToRestState,
    autoplay,
    active,
    levaSetValues,
    timelineRef,
  });

  return <div ref={wrapRef} className={skillSvgClassName(className)} />;
}

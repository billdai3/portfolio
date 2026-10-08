import gsap from "gsap";
import type { RefObject } from "react";

import skillCodingSvg from "../assets/skill-coding.svg?raw";
import {
  skillSvgClassName,
  useSkillSvgAnimation,
  type SkillLevaSetValues,
  type SkillTimelineHandle,
} from "./useSkillSvgAnimation";

const TIMELINE_DURATION_SEC = 9.2;
const EASE_POWER_OUT = "power1.out";
const SLASH_SVG_ORIGIN = "80 80";
const SLASH_D_ORIGINAL = "M79.75 84L71 102L88.5 66L79.75 84Z";
const SLASH_D_FLAT = "M80 104L68 104L92 104L80 104Z";
const SLASH_D_FINAL = "M80 103L68 82L92 82L80 103Z";

const LEFT1_D_ORIG = "M43 83.9706L59.9706 67";
const LEFT1_D_RESET = "M43 83.9706L59.9706 100.941";
const LEFT1_D_TARGET = "M54.31 68L65.63 79.31";
const LEFT1_D_FINAL = "M54.31 68L65.63 68";
const LEFT1_D_END = "M62.5 82L50 92";
const LEFT2_D_ORIG = "M43 83.9706L59.9706 100.941";
const LEFT2_D_RESET = "M43 83.9706L59.9706 67";
const LEFT2_D_TARGET = "M54.31 68L43 79.31";
const LEFT2_D_FINAL = "M54.31 68L43 68";
const LEFT2_D_END = "M62.5 82L50 72";
const RIGHT1_D_ORIG = "M116.941 83.9706L99.9706 67";
const RIGHT1_D_RESET = "M116.941 83.9706L99.9706 100.941";
const RIGHT1_D_TARGET = "M105.31 68L94 79.31";
const RIGHT1_D_FINAL = "M105.31 68L94 68";
const RIGHT1_D_END = "M97.5 82L110 92";
const RIGHT2_D_ORIG = "M116.941 83.9706L99.9706 100.941";
const RIGHT2_D_RESET = "M116.941 83.9706L99.9706 67";
const RIGHT2_D_TARGET = "M105.31 68L116.63 79.31";
const RIGHT2_D_FINAL = "M105.31 68L116.63 68";
const RIGHT2_D_END = "M97.5 82L110 72";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillCodingTimelineHandle = SkillTimelineHandle;

type LevaSetValues = SkillLevaSetValues;

type SkillCodingAnimationProps = {
  className?: string;
  autoplay?: boolean;
  active?: boolean;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillCodingTimelineHandle | null>;
};

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function buildSkillCodingTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const graphicLeft = q<SVGGElement>(root, "graphic-left");
  const graphicRight = q<SVGGElement>(root, "graphic-right");
  const graphicSlash = q<SVGPathElement>(root, "graphic-slash");
  const graphicLeft1 = q<SVGPathElement>(root, "graphic-left-1");
  const graphicLeft2 = q<SVGPathElement>(root, "graphic-left-2");
  const graphicRight1 = q<SVGPathElement>(root, "graphic-right-1");
  const graphicRight2 = q<SVGPathElement>(root, "graphic-right-2");

  const tl = gsap.timeline({ repeat: -1 });

  applyIdleState(root);

  const tweenDuration = 0.3;
  const ease = EASE_POWER_OUT;

  // t=0.5s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      {
        rotate: "-=12",
        svgOrigin: SLASH_SVG_ORIGIN,
        duration: tweenDuration,
        ease,
      },
      0.5,
    );
  // x: +/-6 是相對於前一個 keyframe 的位移（delta）
  if (graphicLeft) tl.to(graphicLeft, { x: "+=6", duration: tweenDuration, ease }, 0.5);
  if (graphicRight)
    tl.to(graphicRight, { x: "-=6", duration: tweenDuration, ease }, 0.5);

  // t=0.8s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      {
        rotate: "+=12",
        svgOrigin: SLASH_SVG_ORIGIN,
        duration: tweenDuration,
        ease,
      },
      0.8,
    );
  if (graphicLeft) tl.to(graphicLeft, { x: "-=6", duration: tweenDuration, ease }, 0.8);
  if (graphicRight)
    tl.to(graphicRight, { x: "+=6", duration: tweenDuration, ease }, 0.8);

  // t=1.1s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      {
        rotate: "-=12",
        svgOrigin: SLASH_SVG_ORIGIN,
        duration: tweenDuration,
        ease,
      },
      1.1,
    );
  if (graphicLeft) tl.to(graphicLeft, { x: "+=6", duration: tweenDuration, ease }, 1.1);
  if (graphicRight)
    tl.to(graphicRight, { x: "-=6", duration: tweenDuration, ease }, 1.1);

  // t=1.4s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      {
        rotate: "+=12",
        svgOrigin: SLASH_SVG_ORIGIN,
        duration: tweenDuration,
        ease,
      },
      1.4,
    );
  if (graphicLeft) tl.to(graphicLeft, { x: "-=6", duration: tweenDuration, ease }, 1.4);
  if (graphicRight)
    tl.to(graphicRight, { x: "+=6", duration: tweenDuration, ease }, 1.4);

  // t=2s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      { attr: { d: SLASH_D_FLAT }, duration: tweenDuration, ease },
      2,
    );
  if (graphicLeft1)
    tl.to(
      graphicLeft1,
      { attr: { d: LEFT1_D_TARGET }, duration: tweenDuration, ease },
      2,
    );
  if (graphicLeft2)
    tl.to(
      graphicLeft2,
      { attr: { d: LEFT2_D_TARGET }, duration: tweenDuration, ease },
      2,
    );
  if (graphicRight1)
    tl.to(
      graphicRight1,
      { attr: { d: RIGHT1_D_TARGET }, duration: tweenDuration, ease },
      2,
    );
  if (graphicRight2)
    tl.to(
      graphicRight2,
      { attr: { d: RIGHT2_D_TARGET }, duration: tweenDuration, ease },
      2,
    );

  // t=2.8s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 2.8);
  if (graphicLeft) tl.to(graphicLeft, { y: "+=6", duration: tweenDuration, ease }, 2.8);
  if (graphicRight) tl.to(graphicRight, { y: "+=6", duration: tweenDuration, ease }, 2.8);

  // t=3.1s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 3.1);
  if (graphicLeft) tl.to(graphicLeft, { y: "-=6", duration: tweenDuration, ease }, 3.1);
  if (graphicRight) tl.to(graphicRight, { y: "-=6", duration: tweenDuration, ease }, 3.1);

  // t=3.4s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 3.4);
  if (graphicLeft) tl.to(graphicLeft, { y: "+=6", duration: tweenDuration, ease }, 3.4);
  if (graphicRight) tl.to(graphicRight, { y: "+=6", duration: tweenDuration, ease }, 3.4);

  // t=3.7s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 3.7);
  if (graphicLeft) tl.to(graphicLeft, { y: "-=6", duration: tweenDuration, ease }, 3.7);
  if (graphicRight) tl.to(graphicRight, { y: "-=6", duration: tweenDuration, ease }, 3.7);

  // t=4.3s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      { attr: { d: SLASH_D_FINAL }, duration: tweenDuration, ease },
      4.3,
    );
  if (graphicLeft1)
    tl.to(
      graphicLeft1,
      { attr: { d: LEFT1_D_FINAL }, duration: tweenDuration, ease },
      4.3,
    );
  if (graphicLeft2)
    tl.to(
      graphicLeft2,
      { attr: { d: LEFT2_D_FINAL }, duration: tweenDuration, ease },
      4.3,
    );
  if (graphicRight1)
    tl.to(
      graphicRight1,
      { attr: { d: RIGHT1_D_FINAL }, duration: tweenDuration, ease },
      4.3,
    );
  if (graphicRight2)
    tl.to(
      graphicRight2,
      { attr: { d: RIGHT2_D_FINAL }, duration: tweenDuration, ease },
      4.3,
    );

  // t=5.1s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 5.1);
  if (graphicLeft) tl.to(graphicLeft, { y: "-=6", duration: tweenDuration, ease }, 5.1);
  if (graphicRight) tl.to(graphicRight, { y: "-=6", duration: tweenDuration, ease }, 5.1);

  // t=5.4s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 5.4);
  if (graphicLeft) tl.to(graphicLeft, { y: "+=6", duration: tweenDuration, ease }, 5.4);
  if (graphicRight) tl.to(graphicRight, { y: "+=6", duration: tweenDuration, ease }, 5.4);

  // t=5.7s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 5.7);
  if (graphicLeft) tl.to(graphicLeft, { y: "-=6", duration: tweenDuration, ease }, 5.7);
  if (graphicRight) tl.to(graphicRight, { y: "-=6", duration: tweenDuration, ease }, 5.7);

  // t=6s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 6);
  if (graphicLeft) tl.to(graphicLeft, { y: "+=6", duration: tweenDuration, ease }, 6);
  if (graphicRight) tl.to(graphicRight, { y: "+=6", duration: tweenDuration, ease }, 6);

  // t=6.6s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      { attr: { d: SLASH_D_FLAT }, duration: tweenDuration, ease },
      6.6,
    );
  if (graphicLeft1)
    tl.to(
      graphicLeft1,
      { attr: { d: LEFT1_D_END }, duration: tweenDuration, ease },
      6.6,
    );
  if (graphicLeft2)
    tl.to(
      graphicLeft2,
      { attr: { d: LEFT2_D_END }, duration: tweenDuration, ease },
      6.6,
    );
  if (graphicRight1)
    tl.to(
      graphicRight1,
      { attr: { d: RIGHT1_D_END }, duration: tweenDuration, ease },
      6.6,
    );
  if (graphicRight2)
    tl.to(
      graphicRight2,
      { attr: { d: RIGHT2_D_END }, duration: tweenDuration, ease },
      6.6,
    );

  // t=7.4s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 7.4);
  if (graphicLeft) tl.to(graphicLeft, { x: "+=6", duration: tweenDuration, ease }, 7.4);
  if (graphicRight)
    tl.to(graphicRight, { x: "-=6", duration: tweenDuration, ease }, 7.4);

  // t=7.7s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 7.7);
  if (graphicLeft) tl.to(graphicLeft, { x: "-=6", duration: tweenDuration, ease }, 7.7);
  if (graphicRight)
    tl.to(graphicRight, { x: "+=6", duration: tweenDuration, ease }, 7.7);

  // t=8s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "-=6", duration: tweenDuration, ease }, 8);
  if (graphicLeft) tl.to(graphicLeft, { x: "+=6", duration: tweenDuration, ease }, 8);
  if (graphicRight)
    tl.to(graphicRight, { x: "-=6", duration: tweenDuration, ease }, 8);

  // t=8.3s
  if (graphicSlash)
    tl.to(graphicSlash, { y: "+=6", duration: tweenDuration, ease }, 8.3);
  if (graphicLeft) tl.to(graphicLeft, { x: "-=6", duration: tweenDuration, ease }, 8.3);
  if (graphicRight)
    tl.to(graphicRight, { x: "+=6", duration: tweenDuration, ease }, 8.3);

  // t=8.9s
  if (graphicSlash)
    tl.to(
      graphicSlash,
      { attr: { d: SLASH_D_ORIGINAL }, duration: tweenDuration, ease },
      8.9,
    );
  if (graphicLeft1)
    tl.to(
      graphicLeft1,
      { attr: { d: LEFT1_D_RESET }, duration: tweenDuration, ease },
      8.9,
    );
  if (graphicLeft2)
    tl.to(
      graphicLeft2,
      { attr: { d: LEFT2_D_RESET }, duration: tweenDuration, ease },
      8.9,
    );
  if (graphicRight1)
    tl.to(
      graphicRight1,
      { attr: { d: RIGHT1_D_RESET }, duration: tweenDuration, ease },
      8.9,
    );
  if (graphicRight2)
    tl.to(
      graphicRight2,
      { attr: { d: RIGHT2_D_RESET }, duration: tweenDuration, ease },
      8.9,
    );

  // 固定 timeline 結尾，讓 progress 映射穩定
  const lastEnd = 8.9 + tweenDuration; // 9.2
  if (TIMELINE_DURATION_SEC > lastEnd) {
    tl.to({}, { duration: TIMELINE_DURATION_SEC - lastEnd }, lastEnd);
  }

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

/** 動畫 t=0／預設 idle 的絕對休息態。 */
function applyIdleState(root: ParentNode) {
  const graphicLeft = q<SVGGElement>(root, "graphic-left");
  const graphicRight = q<SVGGElement>(root, "graphic-right");
  const graphicSlash = q<SVGPathElement>(root, "graphic-slash");
  const graphicLeft1 = q<SVGPathElement>(root, "graphic-left-1");
  const graphicLeft2 = q<SVGPathElement>(root, "graphic-left-2");
  const graphicRight1 = q<SVGPathElement>(root, "graphic-right-1");
  const graphicRight2 = q<SVGPathElement>(root, "graphic-right-2");

  if (graphicLeft) gsap.set(graphicLeft, { x: 0, y: 0 });
  if (graphicRight) gsap.set(graphicRight, { x: 0, y: 0 });
  if (graphicSlash) {
    gsap.set(graphicSlash, {
      rotation: 0,
      y: 0,
      svgOrigin: SLASH_SVG_ORIGIN,
      attr: { d: SLASH_D_ORIGINAL },
    });
  }
  if (graphicLeft1) gsap.set(graphicLeft1, { attr: { d: LEFT1_D_ORIG } });
  if (graphicLeft2) gsap.set(graphicLeft2, { attr: { d: LEFT2_D_ORIG } });
  if (graphicRight1) gsap.set(graphicRight1, { attr: { d: RIGHT1_D_ORIG } });
  if (graphicRight2) gsap.set(graphicRight2, { attr: { d: RIGHT2_D_ORIG } });
}

function showCompleteState(root: ParentNode) {
  // reduced-motion：循環末幀路徑（RESET），位置仍回原點
  const graphicLeft = q<SVGGElement>(root, "graphic-left");
  const graphicRight = q<SVGGElement>(root, "graphic-right");
  const graphicSlash = q<SVGPathElement>(root, "graphic-slash");
  const graphicLeft1 = q<SVGPathElement>(root, "graphic-left-1");
  const graphicLeft2 = q<SVGPathElement>(root, "graphic-left-2");
  const graphicRight1 = q<SVGPathElement>(root, "graphic-right-1");
  const graphicRight2 = q<SVGPathElement>(root, "graphic-right-2");

  if (graphicLeft) gsap.set(graphicLeft, { x: 0, y: 0 });
  if (graphicRight) gsap.set(graphicRight, { x: 0, y: 0 });
  if (graphicSlash) {
    gsap.set(graphicSlash, {
      rotation: 0,
      y: 0,
      svgOrigin: SLASH_SVG_ORIGIN,
      attr: { d: SLASH_D_ORIGINAL },
    });
  }
  if (graphicLeft1) gsap.set(graphicLeft1, { attr: { d: LEFT1_D_RESET } });
  if (graphicLeft2) gsap.set(graphicLeft2, { attr: { d: LEFT2_D_RESET } });
  if (graphicRight1) gsap.set(graphicRight1, { attr: { d: RIGHT1_D_RESET } });
  if (graphicRight2) gsap.set(graphicRight2, { attr: { d: RIGHT2_D_RESET } });
}

/** Hover out：回到 timeline t=0 的絕對休息態（非路徑倒轉）。 */
function tweenToRestState(
  root: ParentNode,
  options?: { duration?: number; onComplete?: () => void },
) {
  const duration = options?.duration ?? 0.35;
  const ease = "power2.out";
  const graphicLeft = q<SVGGElement>(root, "graphic-left");
  const graphicRight = q<SVGGElement>(root, "graphic-right");
  const graphicSlash = q<SVGPathElement>(root, "graphic-slash");
  const graphicLeft1 = q<SVGPathElement>(root, "graphic-left-1");
  const graphicLeft2 = q<SVGPathElement>(root, "graphic-left-2");
  const graphicRight1 = q<SVGPathElement>(root, "graphic-right-1");
  const graphicRight2 = q<SVGPathElement>(root, "graphic-right-2");

  const rest = gsap.timeline({ onComplete: options?.onComplete });
  if (graphicLeft) {
    rest.to(graphicLeft, { x: 0, y: 0, duration, ease, overwrite: "auto" }, 0);
  }
  if (graphicRight) {
    rest.to(graphicRight, { x: 0, y: 0, duration, ease, overwrite: "auto" }, 0);
  }
  if (graphicSlash) {
    rest.to(
      graphicSlash,
      {
        rotation: 0,
        y: 0,
        svgOrigin: SLASH_SVG_ORIGIN,
        attr: { d: SLASH_D_ORIGINAL },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (graphicLeft1) {
    rest.to(
      graphicLeft1,
      { attr: { d: LEFT1_D_ORIG }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (graphicLeft2) {
    rest.to(
      graphicLeft2,
      { attr: { d: LEFT2_D_ORIG }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (graphicRight1) {
    rest.to(
      graphicRight1,
      { attr: { d: RIGHT1_D_ORIG }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (graphicRight2) {
    rest.to(
      graphicRight2,
      { attr: { d: RIGHT2_D_ORIG }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  return rest;
}

export default function SkillCodingAnimation({
  className,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: SkillCodingAnimationProps) {
  const wrapRef = useSkillSvgAnimation({
    svgHtml: skillCodingSvg,
    sceneSelector: "#skill-coding",
    buildTimeline: buildSkillCodingTimeline,
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

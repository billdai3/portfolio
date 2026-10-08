import gsap from "gsap";
import type { RefObject } from "react";

import skillWorkflowSvg from "../assets/skill-workflow.svg?raw";
import {
  skillSvgClassName,
  useSkillSvgAnimation,
  type SkillLevaSetValues,
  type SkillTimelineHandle,
} from "./useSkillSvgAnimation";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillWorkflowTimelineHandle = SkillTimelineHandle;

type LevaSetValues = SkillLevaSetValues;

type SkillWorkflowAnimationProps = {
  className?: string;
  autoplay?: boolean;
  active?: boolean;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillWorkflowTimelineHandle | null>;
};

const BUBBLE_STROKE_ATTR = {
  "vector-effect": "non-scaling-stroke",
  "stroke-width": 6,
};
const BUBBLE_STROKE_IDS = ["bubble-1", "bubble-2", "bubble-3", "bubble-4"] as const;
const LINE_IDS = ["line-1", "line-2", "line-3", "line-4"] as const;
const LINE_ORIGIN = "0 2";
const BUBBLE_CENTER_ORIGIN = "50% 50%";
const BUBBLE3_ORIGIN = "20% 50%";
const BUBBLE4_ORIGIN = "2 30";
const EASE_PHASE_1 = "back.in";
const EASE_PHASE_2 = "power1.out";
const T_PHASE_1 = 0.5;
const T_PHASE_2 = 0.8;
const DUR_PHASE_1 = 0.3;
const DUR_PHASE_2 = 0.2;
const EASE_REVEAL = "back.out";
const EASE_LINE_REVEAL = "power1.out";
const DUR_REVEAL = 0.3;
const T_BUBBLE1_IN = 1.8;
const T_BUBBLE2_IN = 2.15;
const T_BUBBLE3_IN = 2.5;
const T_LINE1_IN = 2.85;
const T_LINE2_IN = 3.15;
const T_BUBBLE4_IN = 4.2;
const T_LINE3_IN = 4.55;
const T_LINE4_IN = 4.85;
const TIMELINE_DURATION_SEC = 5.4;
const ANIM_END_SEC = 5.15;

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function buildSkillWorkflowTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const bubble1 = q<SVGPathElement>(root, "bubble-1");
  const bubble2 = q<SVGPathElement>(root, "bubble-2");
  const bubble3 = q<SVGRectElement>(root, "bubble-3");
  const bubble4 = q<SVGPathElement>(root, "bubble-4");
  const line1 = q<SVGRectElement>(root, "line-1");
  const line2 = q<SVGRectElement>(root, "line-2");
  const line3 = q<SVGRectElement>(root, "line-3");
  const line4 = q<SVGRectElement>(root, "line-4");
  const lines = [line1, line2, line3, line4];

  const tl = gsap.timeline({ repeat: -1 });

  for (const id of BUBBLE_STROKE_IDS) {
    const bubble = q<SVGElement>(root, id);
    if (bubble) {
      tl.set(bubble, { attr: { ...BUBBLE_STROKE_ATTR } }, 0);
    }
  }

  if (bubble1) {
    tl.set(bubble1, { scale: 1, transformOrigin: BUBBLE_CENTER_ORIGIN }, 0);
  }
  if (bubble2) {
    tl.set(bubble2, { scale: 1, transformOrigin: BUBBLE_CENTER_ORIGIN }, 0);
  }
  if (bubble3) {
    tl.set(
      bubble3,
      { scaleX: 1, scaleY: 1, transformOrigin: BUBBLE3_ORIGIN },
      0,
    );
  }
  if (bubble4) {
    tl.set(bubble4, { scale: 1, transformOrigin: BUBBLE4_ORIGIN }, 0);
  }
  for (const line of lines) {
    if (line) {
      tl.set(line, { scaleX: 1, transformOrigin: LINE_ORIGIN }, 0);
    }
  }

  for (const line of lines) {
    if (!line) continue;
    tl.to(
      line,
      {
        scaleX: 0.1,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_PHASE_1,
        ease: EASE_PHASE_1,
      },
      T_PHASE_1,
    );
    tl.to(
      line,
      {
        scaleX: 0,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_PHASE_2,
        ease: EASE_PHASE_2,
      },
      T_PHASE_2,
    );
  }

  if (bubble1) {
    tl.to(
      bubble1,
      {
        scale: 0.1,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_PHASE_1,
        ease: EASE_PHASE_1,
      },
      T_PHASE_1,
    );
    tl.to(
      bubble1,
      {
        scale: 0,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_PHASE_2,
        ease: EASE_PHASE_2,
      },
      T_PHASE_2,
    );
  }
  if (bubble2) {
    tl.to(
      bubble2,
      {
        scale: 0.1,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_PHASE_1,
        ease: EASE_PHASE_1,
      },
      T_PHASE_1,
    );
    tl.to(
      bubble2,
      {
        scale: 0,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_PHASE_2,
        ease: EASE_PHASE_2,
      },
      T_PHASE_2,
    );
  }
  if (bubble3) {
    tl.to(
      bubble3,
      {
        scaleX: 0.1,
        transformOrigin: BUBBLE3_ORIGIN,
        duration: DUR_PHASE_1,
        ease: EASE_PHASE_1,
      },
      T_PHASE_1,
    );
    tl.to(
      bubble3,
      {
        scaleX: 0,
        transformOrigin: BUBBLE3_ORIGIN,
        duration: DUR_PHASE_2,
        ease: EASE_PHASE_2,
      },
      T_PHASE_2,
    );
  }
  if (bubble4) {
    tl.to(
      bubble4,
      {
        scale: 0.1,
        transformOrigin: BUBBLE4_ORIGIN,
        duration: DUR_PHASE_1,
        ease: EASE_PHASE_1,
      },
      T_PHASE_1,
    );
    tl.to(
      bubble4,
      {
        scale: 0,
        transformOrigin: BUBBLE4_ORIGIN,
        duration: DUR_PHASE_2,
        ease: EASE_PHASE_2,
      },
      T_PHASE_2,
    );
  }

  if (bubble1) {
    tl.to(
      bubble1,
      {
        scale: 1,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_REVEAL,
      },
      T_BUBBLE1_IN,
    );
  }
  if (bubble2) {
    tl.to(
      bubble2,
      {
        scale: 1,
        transformOrigin: BUBBLE_CENTER_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_REVEAL,
      },
      T_BUBBLE2_IN,
    );
  }
  if (bubble3) {
    tl.to(
      bubble3,
      {
        scaleX: 1,
        transformOrigin: BUBBLE3_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_REVEAL,
      },
      T_BUBBLE3_IN,
    );
  }

  if (line1) {
    tl.to(
      line1,
      {
        scaleX: 1,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_LINE_REVEAL,
      },
      T_LINE1_IN,
    );
  }
  if (line2) {
    tl.to(
      line2,
      {
        scaleX: 1,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_LINE_REVEAL,
      },
      T_LINE2_IN,
    );
  }
  if (bubble4) {
    tl.to(
      bubble4,
      {
        scale: 1,
        transformOrigin: BUBBLE4_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_REVEAL,
      },
      T_BUBBLE4_IN,
    );
  }
  if (line3) {
    tl.to(
      line3,
      {
        scaleX: 1,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_LINE_REVEAL,
      },
      T_LINE3_IN,
    );
  }
  if (line4) {
    tl.to(
      line4,
      {
        scaleX: 1,
        transformOrigin: LINE_ORIGIN,
        duration: DUR_REVEAL,
        ease: EASE_LINE_REVEAL,
      },
      T_LINE4_IN,
    );
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
  const bubble1 = q<SVGPathElement>(root, "bubble-1");
  const bubble2 = q<SVGPathElement>(root, "bubble-2");
  const bubble3 = q<SVGRectElement>(root, "bubble-3");
  const bubble4 = q<SVGPathElement>(root, "bubble-4");
  const lines = LINE_IDS.map((id) => q<SVGRectElement>(root, id));

  for (const id of BUBBLE_STROKE_IDS) {
    const bubble = q<SVGElement>(root, id);
    if (bubble) {
      gsap.set(bubble, { attr: { ...BUBBLE_STROKE_ATTR } });
    }
  }

  if (bubble1) {
    gsap.set(bubble1, {
      scale: 1,
      transformOrigin: BUBBLE_CENTER_ORIGIN,
    });
  }
  if (bubble2) {
    gsap.set(bubble2, {
      scale: 1,
      transformOrigin: BUBBLE_CENTER_ORIGIN,
    });
  }
  if (bubble3) {
    gsap.set(bubble3, {
      scaleX: 1,
      scaleY: 1,
      transformOrigin: BUBBLE3_ORIGIN,
    });
  }
  if (bubble4) {
    gsap.set(bubble4, {
      scale: 1,
      transformOrigin: BUBBLE4_ORIGIN,
    });
  }
  for (const line of lines) {
    if (line) {
      gsap.set(line, { scaleX: 1, transformOrigin: LINE_ORIGIN });
    }
  }
}

export default function SkillWorkflowAnimation({
  className,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: SkillWorkflowAnimationProps) {
  const wrapRef = useSkillSvgAnimation({
    svgHtml: skillWorkflowSvg,
    sceneSelector: "#skill-workflow",
    buildTimeline: buildSkillWorkflowTimeline,
    showCompleteState,
    autoplay,
    active,
    levaSetValues,
    timelineRef,
  });

  return <div ref={wrapRef} className={skillSvgClassName(className)} />;
}

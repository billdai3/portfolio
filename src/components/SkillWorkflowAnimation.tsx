import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import skillWorkflowSvg from "../assets/skill-workflow.svg?raw";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillWorkflowTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type SkillWorkflowAnimationProps = {
  className?: string;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillWorkflowTimelineHandle | null>;
};

const TIMELINE_DURATION_SEC = 0.8;
const BUBBLE_EASE = "back.in";

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function buildSkillWorkflowTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const bubble3 = q<SVGRectElement>(root, "bubble-3");
  const tl = gsap.timeline({ repeat: -1 });

  if (bubble3) {
    tl.set(
      bubble3,
      {
        scaleX: 1,
        transformOrigin: "20% 50%",
      },
      0,
    );
    tl.to(
      bubble3,
      {
        scaleX: 0,
        transformOrigin: "20% 50%",
        duration: 0.3,
        ease: BUBBLE_EASE,
      },
      0.5,
    );
  }

  tl.to({}, { duration: TIMELINE_DURATION_SEC - 0.8 }, 0.8);

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

function showCompleteState(root: ParentNode) {
  const bubble3 = q<SVGRectElement>(root, "bubble-3");
  if (bubble3) {
    gsap.set(bubble3, { scaleX: 0, transformOrigin: "20% 50%" });
  }
}

export default function SkillWorkflowAnimation({
  className,
  levaSetValues,
  timelineRef,
}: SkillWorkflowAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector("#skill-workflow") ?? svg;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showCompleteState(scene);
        if (timelineRef) timelineRef.current = null;
        return;
      }

      const tl = buildSkillWorkflowTimeline(scene, levaSetValues);
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
      dangerouslySetInnerHTML={{ __html: skillWorkflowSvg }}
    />
  );
}

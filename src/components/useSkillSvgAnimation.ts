import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

export type SkillTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

export type SkillLevaSetValues = (values: Record<string, unknown>) => void;

type UseSkillSvgAnimationOptions = {
  svgHtml: string;
  sceneSelector: string;
  buildTimeline: (
    root: ParentNode,
    levaSetValues?: SkillLevaSetValues,
  ) => gsap.core.Timeline;
  showCompleteState: (root: ParentNode) => void;
  autoplay?: boolean;
  active?: boolean;
  levaSetValues?: SkillLevaSetValues;
  timelineRef?: RefObject<SkillTimelineHandle | null>;
};

/**
 * 共用：單次掛載 SVG、建立 timeline、依 autoplay / active 播放。
 * 播放策略留在這裡，不塞進 build*Timeline。
 */
export function useSkillSvgAnimation({
  svgHtml,
  sceneSelector,
  buildTimeline,
  showCompleteState,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: UseSkillSvgAnimationOptions) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.innerHTML = svgHtml;
  }, [svgHtml]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector(sceneSelector) ?? svg;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showCompleteState(scene);
        if (timelineRef) timelineRef.current = null;
        return;
      }

      const tl = buildTimeline(scene, levaSetValues);
      // 播放策略：建立後先停住，再依 autoplay / active 決定
      tl.pause();
      tl.progress(0);
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
      const shouldPlay = active !== undefined ? active : autoplay;
      if (shouldPlay) tl.play();
    }, svg);

    return () => {
      if (timelineRef) timelineRef.current = null;
      tlRef.current = null;
      ctx.revert();
    };
    // active 由下方 effect 控制，避免 hover 時重建 timeline
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [autoplay, buildTimeline, levaSetValues, sceneSelector, showCompleteState, timelineRef]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl || active === undefined) return;
    if (active) {
      tl.play();
      return;
    }
    tl.pause();
    tl.progress(0);
    levaSetValues?.({ progress: 0 });
  }, [active, levaSetValues]);

  return wrapRef;
}

export function skillSvgClassName(className?: string) {
  return ["[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full", className]
    .filter(Boolean)
    .join(" ");
}

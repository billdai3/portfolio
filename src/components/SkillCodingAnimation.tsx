import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

import skillCodingSvg from "../assets/skill-coding.svg?raw";

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
export type SkillCodingTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

type LevaSetValues = (values: Record<string, unknown>) => void;

type SkillCodingAnimationProps = {
  className?: string;
  /** 預設 true；About 等 hover 播放場景請設 false，並用 active 控制。 */
  autoplay?: boolean;
  /** 有傳入時依此播放／暫停（false 會停在開頭）。 */
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

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // 初始狀態，避免相對位移造成累積偏移
  if (graphicLeft) tl.set(graphicLeft, { x: 0, y: 0 }, 0);
  if (graphicRight) tl.set(graphicRight, { x: 0, y: 0 }, 0);
  if (graphicSlash) {
    tl.set(
      graphicSlash,
      {
        rotation: 0,
        y: 0,
        svgOrigin: SLASH_SVG_ORIGIN,
        attr: { d: SLASH_D_ORIGINAL },
      },
      0,
    );
  }
  if (graphicLeft1) tl.set(graphicLeft1, { attr: { d: LEFT1_D_ORIG } }, 0);
  if (graphicLeft2) tl.set(graphicLeft2, { attr: { d: LEFT2_D_ORIG } }, 0);
  if (graphicRight1) tl.set(graphicRight1, { attr: { d: RIGHT1_D_ORIG } }, 0);
  if (graphicRight2) tl.set(graphicRight2, { attr: { d: RIGHT2_D_ORIG } }, 0);

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

function showCompleteState(root: ParentNode) {
  // t=8.9 的 tween（duration 0.3）結束時即視為「完成」狀態
  const graphicLeft = q<SVGGElement>(root, "graphic-left");
  const graphicRight = q<SVGGElement>(root, "graphic-right");
  const graphicSlash = q<SVGPathElement>(root, "graphic-slash");
  const graphicLeft1 = q<SVGPathElement>(root, "graphic-left-1");
  const graphicLeft2 = q<SVGPathElement>(root, "graphic-left-2");
  const graphicRight1 = q<SVGPathElement>(root, "graphic-right-1");
  const graphicRight2 = q<SVGPathElement>(root, "graphic-right-2");

  // 最後 keyframe 後應回到原始位置（x=0, y=0）
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

export default function SkillCodingAnimation({
  className,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: SkillCodingAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // 只掛一次 SVG，避免 active 重渲時 dangerouslySetInnerHTML 洗掉 GSAP 樣式
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.innerHTML = skillCodingSvg;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector("#skill-coding") ?? svg;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showCompleteState(scene);
        if (timelineRef) timelineRef.current = null;
        return;
      }

      const tl = buildSkillCodingTimeline(scene, levaSetValues);
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
  }, [autoplay, levaSetValues, timelineRef]);

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

  return (
    <div
      ref={wrapRef}
      className={[
        "[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

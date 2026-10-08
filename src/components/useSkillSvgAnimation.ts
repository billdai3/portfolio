import gsap from "gsap";
import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

export type SkillTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
};

export type SkillLevaSetValues = (values: Record<string, unknown>) => void;

export type TweenToRestState = (
  root: ParentNode,
  options?: {
    duration?: number;
    onComplete?: () => void;
  },
) => gsap.core.Timeline;

type UseSkillSvgAnimationOptions = {
  svgHtml: string;
  sceneSelector: string;
  buildTimeline: (
    root: ParentNode,
    levaSetValues?: SkillLevaSetValues,
  ) => gsap.core.Timeline;
  showCompleteState: (root: ParentNode) => void;
  /** 動畫 t=0 絕對休息態；掛上 SVG 後立刻套用。 */
  applyIdleState: (root: ParentNode) => void;
  /** Hover out：各元件屬性直接過渡回初始態（非 timeline 倒轉）。 */
  tweenToRestState: TweenToRestState;
  autoplay?: boolean;
  active?: boolean;
  levaSetValues?: SkillLevaSetValues;
  timelineRef?: RefObject<SkillTimelineHandle | null>;
};

const REST_DURATION_SEC = 0.35;

/**
 * 共用：單次掛載 SVG、建立 timeline、依 autoplay / active 播放。
 * 相對位移（+=）在中斷後會讓 playhead 與 DOM 脫節，因此每次播放前重建 timeline。
 */
export function useSkillSvgAnimation({
  svgHtml,
  sceneSelector,
  buildTimeline,
  showCompleteState,
  applyIdleState,
  tweenToRestState,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: UseSkillSvgAnimationOptions) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const sceneRef = useRef<ParentNode | null>(null);
  const restTlRef = useRef<gsap.core.Timeline | null>(null);
  const rebuildRef = useRef<(() => gsap.core.Timeline) | null>(null);

  const onApplyIdle = useEffectEvent((root: ParentNode) => {
    applyIdleState(root);
  });

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.innerHTML = svgHtml;
    const svg = wrap.querySelector("svg");
    if (!svg) return;
    const scene = svg.querySelector(sceneSelector) ?? svg;
    sceneRef.current = scene;
    onApplyIdle(scene);
  }, [svgHtml, sceneSelector]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    const scene = svg.querySelector(sceneSelector) ?? svg;
    sceneRef.current = scene;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      showCompleteState(scene);
      if (timelineRef) timelineRef.current = null;
      return () => {
        sceneRef.current = null;
      };
    }

    const attachHandle = () => {
      if (!timelineRef) return;
      timelineRef.current = {
        seek: (progress: number) => {
          restTlRef.current?.kill();
          restTlRef.current = null;
          const fresh = rebuildRef.current?.() ?? tlRef.current;
          if (!fresh) return;
          fresh.pause();
          fresh.progress(Math.max(0, Math.min(1, progress)));
        },
        getProgress: () => tlRef.current?.progress() ?? 0,
        restart: () => {
          restTlRef.current?.kill();
          restTlRef.current = null;
          const fresh = rebuildRef.current?.();
          if (!fresh) return;
          levaSetValues?.({ progress: 0 });
          fresh.play();
        },
      };
    };

    const rebuild = () => {
      tlRef.current?.kill();
      onApplyIdle(scene);
      const next = buildTimeline(scene, levaSetValues);
      next.pause();
      next.progress(0);
      tlRef.current = next;
      attachHandle();
      return next;
    };

    rebuildRef.current = rebuild;

    const ctx = gsap.context(() => {
      const tl = rebuild();
      levaSetValues?.({ progress: 0 });
      const shouldPlay = active !== undefined ? active : autoplay;
      if (shouldPlay) tl.play();
    }, svg);

    return () => {
      restTlRef.current?.kill();
      restTlRef.current = null;
      rebuildRef.current = null;
      sceneRef.current = null;
      if (timelineRef) timelineRef.current = null;
      tlRef.current?.kill();
      tlRef.current = null;
      ctx.revert();
    };
    // active 由下方 effect 控制，避免 hover 時重建 timeline setup
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [
    autoplay,
    buildTimeline,
    levaSetValues,
    sceneSelector,
    showCompleteState,
    timelineRef,
    tweenToRestState,
  ]);

  useEffect(() => {
    if (active === undefined) return;

    if (active) {
      restTlRef.current?.kill();
      restTlRef.current = null;
      // 若中斷回位，先瞬間對齊休息態，再重建（避免 += 吃到半路座標）
      const scene = sceneRef.current;
      if (scene) {
        onApplyIdle(scene);
      }
      const fresh = rebuildRef.current?.();
      fresh?.play();
      return;
    }

    const tl = tlRef.current;
    if (!tl) return;

    tl.pause();
    // 已在開頭（含初次 mount）不必再播回位
    if (tl.progress() === 0 && !restTlRef.current) {
      levaSetValues?.({ progress: 0 });
      return;
    }

    const scene = sceneRef.current;
    if (!scene) {
      rebuildRef.current?.();
      levaSetValues?.({ progress: 0 });
      return;
    }

    restTlRef.current?.kill();
    restTlRef.current = tweenToRestState(scene, {
      duration: REST_DURATION_SEC,
      onComplete: () => {
        // 回位結束後換一條乾淨 timeline，供下次 hover 使用
        rebuildRef.current?.();
        levaSetValues?.({ progress: 0 });
        restTlRef.current = null;
      },
    });
  }, [active, levaSetValues, tweenToRestState]);

  return wrapRef;
}

export function skillSvgClassName(className?: string) {
  return ["[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full", className]
    .filter(Boolean)
    .join(" ");
}

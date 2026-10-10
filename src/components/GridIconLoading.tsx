import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

import iconGridSvg from "../assets/icon-grid.svg?raw";
import {
  applyGridIconLoadingAppearance,
  buildGridIconTimeline,
  showGridIconComplete,
  type GridIconLevaSetValues,
} from "./gridIconTimeline";

/** 給 playground 調參用。 */
export type GridIconLoadingHandle = {
  /** 僅 scrub；不暫停（避免 Leva 回寫把播放掐掉） */
  seek: (progress: number) => void;
  getProgress: () => number;
  restart: () => void;
  setTimeScale: (scale: number) => void;
  pause: () => void;
  play: () => void;
};

type GridIconLoadingProps = {
  className?: string;
  style?: CSSProperties;
  /** 預設 true：適合不定時長等待 */
  loop?: boolean;
  /** 相對 hero 原速的播放倍率；預設 1.5（加快） */
  timeScale?: number;
  /** 循環接縫前淡出再重播；預設 true */
  fadeOutBeforeRepeat?: boolean;
  /** 完整一輪後停在結尾畫面的秒數；預設 0.3 */
  endHoldSec?: number;
  /** 淡出後、重播前的空隙秒數 */
  repeatDelay?: number;
  levaSetValues?: GridIconLevaSetValues;
  timelineRef?: RefObject<GridIconLoadingHandle | null>;
};

const DEFAULT_TIME_SCALE = 1.3;
const DEFAULT_END_HOLD_SEC = 0.3;
const DEFAULT_REPEAT_DELAY = 0.15;
/** 詳情／預設 loading 尺寸 */
export const GRID_ICON_LOADING_SIZE_PX = 72;

export default function GridIconLoading({
  className,
  style,
  loop = true,
  timeScale = DEFAULT_TIME_SCALE,
  fadeOutBeforeRepeat = true,
  endHoldSec = DEFAULT_END_HOLD_SEC,
  repeatDelay = DEFAULT_REPEAT_DELAY,
  levaSetValues,
  timelineRef,
}: GridIconLoadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const timeScaleRef = useRef(timeScale);
  const levaSetRef = useRef(levaSetValues);
  const timelineHandleRef = useRef(timelineRef);
  timeScaleRef.current = timeScale;
  levaSetRef.current = levaSetValues;
  timelineHandleRef.current = timelineRef;

  // 用 ref 灌 SVG，避免 style/size 重渲染時 dangerouslySetInnerHTML 清掉 GSAP 狀態
  useLayoutEffect(() => {
    const root = wrapRef.current;
    if (!root || root.querySelector("svg")) return;
    root.innerHTML = iconGridSvg;
  }, []);

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
        console.warn("[GridIconLoading] Missing #graphic in icon-grid.svg");
      }
      return;
    }

    const handleRef = timelineHandleRef.current;

    const ctx = gsap.context(() => {
      applyGridIconLoadingAppearance(graphic);

      if (prefersReduced) {
        showGridIconComplete(graphic, { includeBackgroundFill: true });
        if (handleRef) handleRef.current = null;
        return;
      }

      // endHold 用 timeline 秒 × timeScale，讓牆上時鐘約等於 endHoldSec
      const scale = timeScaleRef.current;
      const tl = buildGridIconTimeline(graphic, {
        levaSetValues: (values) => levaSetRef.current?.(values),
        repeat: loop ? -1 : 0,
        repeatDelay: loop ? repeatDelay : 0,
        endHoldSec: endHoldSec > 0 ? endHoldSec * scale : 0,
        fadeOutBeforeRepeat: loop && fadeOutBeforeRepeat,
        includeBackgroundFill: true,
        logLabel: "GridIconLoading",
      });

      tl.timeScale(scale);
      tlRef.current = tl;

      if (handleRef) {
        handleRef.current = {
          seek: (progress: number) => {
            const t = tlRef.current;
            if (!t) return;
            const wasActive = t.isActive();
            t.progress(Math.max(0, Math.min(1, progress)));
            if (wasActive) t.play();
          },
          getProgress: () => tlRef.current?.progress() ?? 0,
          restart: () => {
            const t = tlRef.current;
            if (!t) return;
            t.progress(0);
            levaSetRef.current?.({ progress: 0 });
            t.play();
          },
          setTimeScale: (scale: number) => {
            tlRef.current?.timeScale(scale);
          },
          pause: () => {
            tlRef.current?.pause();
          },
          play: () => {
            tlRef.current?.play();
          },
        };
      }

      levaSetRef.current?.({ progress: 0 });
      tl.progress(0);
      tl.play();
    }, svg);

    return () => {
      if (handleRef) handleRef.current = null;
      tlRef.current = null;
      ctx.revert();
    };
  }, [endHoldSec, fadeOutBeforeRepeat, loop, repeatDelay]);

  useEffect(() => {
    tlRef.current?.timeScale(timeScale);
  }, [timeScale]);

  return (
    <div
      ref={wrapRef}
      className={[
        "[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      role="status"
      aria-busy="true"
      aria-label="載入中"
    />
  );
}

/** 詳情頁用的置中 loading（含可視文字給 a11y）。 */
export function GridIconLoadingBlock({
  className,
  label = "載入中…",
  sizePx = GRID_ICON_LOADING_SIZE_PX,
  ...props
}: Omit<GridIconLoadingProps, "className" | "style"> & {
  className?: string;
  label?: string;
  sizePx?: number;
}) {
  return (
    <div
      className={[
        // 扣掉 WorkProjectLayout 上方 padding，讓圖示落在視窗視覺中心
        "flex min-h-[calc(100svh-7rem)] flex-col items-center justify-center lg:min-h-[calc(100svh-8.5rem)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <GridIconLoading
        className="shrink-0"
        style={{ width: sizePx, height: sizePx }}
        {...props}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

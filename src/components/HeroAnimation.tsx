import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import iconGridSvg from "../assets/icon-grid.svg?raw";
import {
  buildGridIconTimeline,
  showGridIconComplete,
  type GridIconLevaSetValues,
} from "./gridIconTimeline";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type GridIconTimelineHandle = {
  seek: (progress: number) => void;
  getProgress: () => number;
  /** 回到起點並從頭播放。 */
  restart: () => void;
};

type HeroAnimationProps = {
  className?: string;
  levaSetValues?: GridIconLevaSetValues;
  gridIconTimelineRef?: RefObject<GridIconTimelineHandle | null>;
};

export default function HeroAnimation({
  className,
  levaSetValues,
  gridIconTimelineRef,
}: HeroAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

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
        console.warn("[HeroAnimation] Missing #graphic in icon-grid.svg");
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        showGridIconComplete(graphic);
        if (gridIconTimelineRef) {
          gridIconTimelineRef.current = null;
        }
        return;
      }

      const tl = buildGridIconTimeline(graphic, {
        levaSetValues,
        logLabel: "HeroAnimation",
      });

      tlRef.current = tl;

      if (gridIconTimelineRef) {
        gridIconTimelineRef.current = {
          seek: (progress: number) => {
            const t = tlRef.current;
            if (!t) return;
            const p = Math.max(0, Math.min(1, progress));
            t.pause();
            t.progress(p);
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
      if (gridIconTimelineRef) {
        gridIconTimelineRef.current = null;
      }
      tlRef.current = null;
      ctx.revert();
    };
  }, [levaSetValues, gridIconTimelineRef]);

  return (
    <div
      ref={wrapRef}
      className={[
        "[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: iconGridSvg }}
    />
  );
}

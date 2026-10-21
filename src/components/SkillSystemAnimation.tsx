import gsap from "gsap";
import type { RefObject } from "react";

import skillSystemSvg from "../assets/skills/skill-system.svg?raw";
import {
  skillSvgClassName,
  useSkillSvgAnimation,
  type SkillLevaSetValues,
  type SkillTimelineHandle,
} from "./useSkillSvgAnimation";

const TIMELINE_DURATION_SEC = 7.2;
const SYM_EASE = "power1.out";
const SYM_DUR = 0.3;
const ANIM_END_SEC = 5.7;
const SYMBOL_ORIGIN = "50% 50%";
const DONUT_SPIN_DUR = 0.5;
const DONUT_SPIN_EASE = "power1.in";
const SVG_ORIGIN = "80 80";

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillSystemTimelineHandle = SkillTimelineHandle;

type LevaSetValues = SkillLevaSetValues;

type SkillSystemAnimationProps = {
  className?: string;
  autoplay?: boolean;
  active?: boolean;
  levaSetValues?: LevaSetValues;
  timelineRef?: RefObject<SkillSystemTimelineHandle | null>;
};

function q<T extends Element>(root: ParentNode, id: string): T | null {
  return root.querySelector<T>(`#${id}`);
}

function buildSkillSystemTimeline(
  root: ParentNode,
  levaSetValues?: LevaSetValues,
): gsap.core.Timeline {
  const donut = q<SVGGElement>(root, "donut");
  const donutCover = q<SVGElement>(root, "donut-cover");
  const donutIn = q<SVGCircleElement>(root, "donut-in");
  const donutOut20 = q<SVGElement>(root, "donut-out-20");
  const donutOut40 = q<SVGElement>(root, "donut-out-40");
  const donutOut60 = q<SVGElement>(root, "donut-out-60");
  const donutOut80 = q<SVGElement>(root, "donut-out-80");
  const donutOut100 = q<SVGElement>(root, "donut-out-100");
  const symbol = q<SVGGElement>(root, "symbol");
  const symbolTOut = q<SVGRectElement>(root, "symbol-t-out");
  const symbolROut = q<SVGRectElement>(root, "symbol-r-out");
  const symbolBOut = q<SVGRectElement>(root, "symbol-b-out");
  const symbolLOut = q<SVGRectElement>(root, "symbol-l-out");
  const symbolTIn = q<SVGRectElement>(root, "symbol-t-in");
  const symbolRIn = q<SVGRectElement>(root, "symbol-r-in");
  const symbolBIn = q<SVGRectElement>(root, "symbol-b-in");
  const symbolLIn = q<SVGRectElement>(root, "symbol-l-in");

  const tl = gsap.timeline({ repeat: -1 });
  const symMove = { duration: SYM_DUR, ease: SYM_EASE };

  applyIdleState(root);

  if (symbol) {
    tl.to(
      symbol,
      {
        rotation: "+=45",
        transformOrigin: SYMBOL_ORIGIN,
        duration: SYM_DUR,
        ease: SYM_EASE,
      },
      0.5,
    );
  }

  if (symbolTOut) {
    tl.to(symbolTOut, { attr: { y: "+=5" }, ...symMove }, 1.1);
  }
  if (symbolROut) {
    tl.to(symbolROut, { attr: { x: "+=-5" }, ...symMove }, 1.1);
  }
  if (symbolBOut) {
    tl.to(symbolBOut, { attr: { y: "+=-5" }, ...symMove }, 1.1);
  }
  if (symbolLOut) {
    tl.to(symbolLOut, { attr: { x: "+=5" }, ...symMove }, 1.1);
  }
  if (symbolTIn) {
    tl.to(
      symbolTIn,
      { attr: { y: "+=5", height: "-=15" }, ...symMove },
      1.1,
    );
  }
  if (symbolRIn) {
    tl.to(
      symbolRIn,
      { attr: { x: "+=10", width: "-=15" }, ...symMove },
      1.1,
    );
  }
  if (symbolBIn) {
    tl.to(
      symbolBIn,
      { attr: { y: "+=10", height: "-=15" }, ...symMove },
      1.1,
    );
  }
  if (symbolLIn) {
    tl.to(
      symbolLIn,
      { attr: { x: "+=5", width: "-=15" }, ...symMove },
      1.1,
    );
  }
  if (donutIn) {
    tl.to(donutIn, { attr: { r: 61 }, ...symMove }, 1.1);
  }

  if (donutCover) tl.set(donutCover, { autoAlpha: 1 }, 1.4);
  if (donutOut20) {
    tl.set(donutOut20, { rotation: -72, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut40) {
    tl.set(donutOut40, { rotation: -144, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut60) {
    tl.set(donutOut60, { rotation: -216, svgOrigin: SVG_ORIGIN }, 1.4);
  }
  if (donutOut80) {
    tl.set(donutOut80, { rotation: -288, svgOrigin: SVG_ORIGIN }, 1.4);
  }

  if (symbol) {
    tl.to(
      symbol,
      {
        rotation: 45,
        transformOrigin: SYMBOL_ORIGIN,
        duration: SYM_DUR,
        ease: SYM_EASE,
      },
      2,
    );
  }

  if (symbolTOut) {
    tl.to(symbolTOut, { attr: { y: "+=-5" }, ...symMove }, 2.5);
  }
  if (symbolROut) {
    tl.to(symbolROut, { attr: { x: "+=5" }, ...symMove }, 2.5);
  }
  if (symbolBOut) {
    tl.to(symbolBOut, { attr: { y: "+=5" }, ...symMove }, 2.5);
  }
  if (symbolLOut) {
    tl.to(symbolLOut, { attr: { x: "+=-5" }, ...symMove }, 2.5);
  }
  if (symbolTIn) tl.set(symbolTIn, { attr: { y: "+=10" } }, 2.5);
  if (symbolRIn) tl.set(symbolRIn, { attr: { x: "+=-10" } }, 2.5);
  if (symbolBIn) tl.set(symbolBIn, { attr: { y: "+=-10" } }, 2.5);
  if (symbolLIn) tl.set(symbolLIn, { attr: { x: "+=10" } }, 2.5);

  const scaleInFrom = {
    scale: 0,
    transformOrigin: SYMBOL_ORIGIN,
    duration: SYM_DUR,
    ease: SYM_EASE,
    immediateRender: false,
  };
  if (symbolTIn) tl.from(symbolTIn, scaleInFrom, 2.5);
  if (symbolRIn) tl.from(symbolRIn, scaleInFrom, 2.5);
  if (symbolBIn) tl.from(symbolBIn, scaleInFrom, 2.5);
  if (symbolLIn) tl.from(symbolLIn, scaleInFrom, 2.5);

  if (symbolTIn) {
    tl.to(
      symbolTIn,
      { attr: { y: "+=-15", height: "+=15" }, ...symMove },
      3.2,
    );
  }
  if (symbolRIn) {
    tl.to(symbolRIn, { attr: { width: "+=15" }, ...symMove }, 3.2);
  }
  if (symbolBIn) {
    tl.to(symbolBIn, { attr: { height: "+=15" }, ...symMove }, 3.2);
  }
  if (symbolLIn) {
    tl.to(
      symbolLIn,
      { attr: { x: "+=-15", width: "+=15" }, ...symMove },
      3.2,
    );
  }

  if (donutIn) tl.set(donutIn, { attr: { r: 38 } }, 3.7);

  const donutSpin = {
    rotation: "+=72",
    svgOrigin: SVG_ORIGIN,
    duration: DONUT_SPIN_DUR,
    ease: DONUT_SPIN_EASE,
  };
  if (donutOut20) tl.to(donutOut20, donutSpin, 3.7);
  if (donutOut40) tl.to(donutOut40, donutSpin, 3.7);
  if (donutOut60) tl.to(donutOut60, donutSpin, 3.7);
  if (donutOut80) tl.to(donutOut80, donutSpin, 3.7);
  if (donutOut100) tl.to(donutOut100, donutSpin, 3.7);

  const donutStep = (duration: number) => ({
    rotation: "+=72",
    svgOrigin: SVG_ORIGIN,
    duration,
    ease: "none" as const,
  });

  if (donutCover) tl.set(donutCover, { autoAlpha: 0 }, 4.2);

  if (donutOut40) tl.to(donutOut40, donutStep(0.3), 4.2);
  if (donutOut60) tl.to(donutOut60, donutStep(0.3), 4.2);
  if (donutOut80) tl.to(donutOut80, donutStep(0.3), 4.2);
  if (donutOut100) tl.to(donutOut100, donutStep(0.3), 4.2);

  if (donutOut60) tl.to(donutOut60, donutStep(0.2), 4.5);
  if (donutOut80) tl.to(donutOut80, donutStep(0.2), 4.5);
  if (donutOut100) tl.to(donutOut100, donutStep(0.2), 4.5);

  if (donutOut80) tl.to(donutOut80, donutStep(0.1), 4.7);
  if (donutOut100) tl.to(donutOut100, donutStep(0.1), 4.7);

  if (donutOut100) tl.to(donutOut100, donutStep(0.1), 4.8);

  if (donut) {
    tl.to(
      donut,
      {
        rotation: "+=360",
        svgOrigin: SVG_ORIGIN,
        duration: 0.8,
        ease: SYM_EASE,
      },
      4.9,
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

/** 動畫 t=0／預設 idle 的絕對休息態。 */
function applyIdleState(root: ParentNode) {
  const donut = q<SVGGElement>(root, "donut");
  const donutCover = q<SVGElement>(root, "donut-cover");
  const donutIn = q<SVGCircleElement>(root, "donut-in");
  const donutOut20 = q<SVGElement>(root, "donut-out-20");
  const donutOut40 = q<SVGElement>(root, "donut-out-40");
  const donutOut60 = q<SVGElement>(root, "donut-out-60");
  const donutOut80 = q<SVGElement>(root, "donut-out-80");
  const donutOut100 = q<SVGElement>(root, "donut-out-100");
  const symbol = q<SVGGElement>(root, "symbol");
  const symbolTOut = q<SVGRectElement>(root, "symbol-t-out");
  const symbolROut = q<SVGRectElement>(root, "symbol-r-out");
  const symbolBOut = q<SVGRectElement>(root, "symbol-b-out");
  const symbolLOut = q<SVGRectElement>(root, "symbol-l-out");
  const symbolTIn = q<SVGRectElement>(root, "symbol-t-in");
  const symbolRIn = q<SVGRectElement>(root, "symbol-r-in");
  const symbolBIn = q<SVGRectElement>(root, "symbol-b-in");
  const symbolLIn = q<SVGRectElement>(root, "symbol-l-in");

  const spinIdle = { rotation: 0, svgOrigin: SVG_ORIGIN };
  if (donut) gsap.set(donut, spinIdle);
  if (donutOut20) gsap.set(donutOut20, spinIdle);
  if (donutOut40) gsap.set(donutOut40, spinIdle);
  if (donutOut60) gsap.set(donutOut60, spinIdle);
  if (donutOut80) gsap.set(donutOut80, spinIdle);
  if (donutOut100) gsap.set(donutOut100, spinIdle);
  if (donutCover) gsap.set(donutCover, { autoAlpha: 0 });
  if (donutIn) gsap.set(donutIn, { attr: { r: 38 } });
  if (symbol) {
    gsap.set(symbol, { rotation: -45, transformOrigin: SYMBOL_ORIGIN });
  }
  if (symbolTOut) {
    gsap.set(symbolTOut, { attr: { x: 63, y: 63, width: 34, height: 4 } });
  }
  if (symbolROut) {
    gsap.set(symbolROut, { attr: { x: 93, y: 63, width: 4, height: 34 } });
  }
  if (symbolBOut) {
    gsap.set(symbolBOut, { attr: { x: 63, y: 93, width: 34, height: 4 } });
  }
  if (symbolLOut) {
    gsap.set(symbolLOut, { attr: { x: 63, y: 63, width: 4, height: 34 } });
  }
  if (symbolTIn) {
    gsap.set(symbolTIn, {
      scale: 1,
      transformOrigin: SYMBOL_ORIGIN,
      attr: { x: 78, y: 63, width: 4, height: 19 },
    });
  }
  if (symbolRIn) {
    gsap.set(symbolRIn, {
      scale: 1,
      transformOrigin: SYMBOL_ORIGIN,
      attr: { x: 78, y: 78, width: 19, height: 4 },
    });
  }
  if (symbolBIn) {
    gsap.set(symbolBIn, {
      scale: 1,
      transformOrigin: SYMBOL_ORIGIN,
      attr: { x: 78, y: 78, width: 4, height: 19 },
    });
  }
  if (symbolLIn) {
    gsap.set(symbolLIn, {
      scale: 1,
      transformOrigin: SYMBOL_ORIGIN,
      attr: { x: 63, y: 78, width: 19, height: 4 },
    });
  }
}

function showCompleteState(root: ParentNode) {
  const tl = buildSkillSystemTimeline(root);
  tl.time(ANIM_END_SEC);
  tl.kill();
}

/** Hover out：回到 t=0（symbol -45°、donut 未展開、symbol 原尺寸）。 */
function tweenToRestState(
  root: ParentNode,
  options?: { duration?: number; onComplete?: () => void },
) {
  const duration = options?.duration ?? 0.35;
  const ease = "power2.out";
  const donut = q<SVGGElement>(root, "donut");
  const donutCover = q<SVGElement>(root, "donut-cover");
  const donutIn = q<SVGCircleElement>(root, "donut-in");
  const donutOut20 = q<SVGElement>(root, "donut-out-20");
  const donutOut40 = q<SVGElement>(root, "donut-out-40");
  const donutOut60 = q<SVGElement>(root, "donut-out-60");
  const donutOut80 = q<SVGElement>(root, "donut-out-80");
  const donutOut100 = q<SVGElement>(root, "donut-out-100");
  const symbol = q<SVGGElement>(root, "symbol");
  const symbolTOut = q<SVGRectElement>(root, "symbol-t-out");
  const symbolROut = q<SVGRectElement>(root, "symbol-r-out");
  const symbolBOut = q<SVGRectElement>(root, "symbol-b-out");
  const symbolLOut = q<SVGRectElement>(root, "symbol-l-out");
  const symbolTIn = q<SVGRectElement>(root, "symbol-t-in");
  const symbolRIn = q<SVGRectElement>(root, "symbol-r-in");
  const symbolBIn = q<SVGRectElement>(root, "symbol-b-in");
  const symbolLIn = q<SVGRectElement>(root, "symbol-l-in");

  const rest = gsap.timeline({ onComplete: options?.onComplete });
  const spinRest = { rotation: 0, svgOrigin: SVG_ORIGIN, duration, ease, overwrite: "auto" as const };

  if (donut) rest.to(donut, spinRest, 0);
  if (donutOut20) rest.to(donutOut20, spinRest, 0);
  if (donutOut40) rest.to(donutOut40, spinRest, 0);
  if (donutOut60) rest.to(donutOut60, spinRest, 0);
  if (donutOut80) rest.to(donutOut80, spinRest, 0);
  if (donutOut100) rest.to(donutOut100, spinRest, 0);
  if (donutCover) {
    rest.to(donutCover, { autoAlpha: 0, duration, ease, overwrite: "auto" }, 0);
  }
  if (donutIn) {
    rest.to(donutIn, { attr: { r: 38 }, duration, ease, overwrite: "auto" }, 0);
  }
  if (symbol) {
    rest.to(
      symbol,
      {
        rotation: -45,
        transformOrigin: SYMBOL_ORIGIN,
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (symbolTOut) {
    rest.to(
      symbolTOut,
      { attr: { x: 63, y: 63, width: 34, height: 4 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (symbolROut) {
    rest.to(
      symbolROut,
      { attr: { x: 93, y: 63, width: 4, height: 34 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (symbolBOut) {
    rest.to(
      symbolBOut,
      { attr: { x: 63, y: 93, width: 34, height: 4 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (symbolLOut) {
    rest.to(
      symbolLOut,
      { attr: { x: 63, y: 63, width: 4, height: 34 }, duration, ease, overwrite: "auto" },
      0,
    );
  }
  if (symbolTIn) {
    rest.to(
      symbolTIn,
      {
        scale: 1,
        transformOrigin: SYMBOL_ORIGIN,
        attr: { x: 78, y: 63, width: 4, height: 19 },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (symbolRIn) {
    rest.to(
      symbolRIn,
      {
        scale: 1,
        transformOrigin: SYMBOL_ORIGIN,
        attr: { x: 78, y: 78, width: 19, height: 4 },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (symbolBIn) {
    rest.to(
      symbolBIn,
      {
        scale: 1,
        transformOrigin: SYMBOL_ORIGIN,
        attr: { x: 78, y: 78, width: 4, height: 19 },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  if (symbolLIn) {
    rest.to(
      symbolLIn,
      {
        scale: 1,
        transformOrigin: SYMBOL_ORIGIN,
        attr: { x: 63, y: 78, width: 19, height: 4 },
        duration,
        ease,
        overwrite: "auto",
      },
      0,
    );
  }
  return rest;
}

export default function SkillSystemAnimation({
  className,
  autoplay = true,
  active,
  levaSetValues,
  timelineRef,
}: SkillSystemAnimationProps) {
  const wrapRef = useSkillSvgAnimation({
    svgHtml: skillSystemSvg,
    sceneSelector: "#skill-system",
    buildTimeline: buildSkillSystemTimeline,
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

import gsap from "gsap";

/** 圓圈 0–1.08s */
const CIRCLE_DRAW_TOTAL_SEC = 1.08;
const CIRCLE_EASE = "power2.inOut";
const CIRCLE_DRAW_ORDER = ["line-cir-3", "line-cir-2", "line-cir-1"] as const;

/** 垂直線 0.9–1.4s */
const VERT_START_SEC = 0.9;
const VERT_DRAW_TOTAL_SEC = 0.5;
const VERT_EASE = "none";
const VERT_DRAW_CONFIG = [
  { id: "line-vert-1", growFrom: "top" as const },
  { id: "line-vert-2", growFrom: "bottom" as const },
  { id: "line-vert-3", growFrom: "top" as const },
];

/** 水平線 1.08–1.58s */
const HOR_START_SEC = 1.08;
const HOR_DRAW_TOTAL_SEC = 0.5;
const HOR_EASE = "none";
const HOR_DRAW_ORDER = ["line-hor-1", "line-hor-2", "line-hor-3"] as const;
const HOR_GROW: Record<(typeof HOR_DRAW_ORDER)[number], "left" | "right"> = {
  "line-hor-1": "left",
  "line-hor-2": "right",
  "line-hor-3": "left",
};

/** 矩形描邊 1.08–2s */
const RECT_START_SEC = 1.08;
const RECT_DRAW_TOTAL_SEC = 0.92;
const RECT_EASE = "power1.in";
const RECT_DRAW_ORDER = ["line-rect", "line-rounded-rect"] as const;

/** 交叉線 1.25–1.75s */
const CROSS_START_SEC = 1.25;
const CROSS_DRAW_TOTAL_SEC = 0.5;
const CROSS_EASE = "none";
const CROSS_DRAW_ORDER = ["line-cross-1", "line-cross-2"] as const;
const CROSS_GROW: Record<(typeof CROSS_DRAW_ORDER)[number], "tr-bl" | "br-tl"> = {
  "line-cross-1": "tr-bl",
  "line-cross-2": "br-tl",
};

/** 背景 1.8–2s */
const BG_START_SEC = 1.8;
const BG_DURATION_SEC = 0.2;
const BG_EASE = "power1.inOut";

export type GridIconLevaSetValues = (values: Record<string, unknown>) => void;

export type BuildGridIconTimelineOptions = {
  levaSetValues?: GridIconLevaSetValues;
  /** 循環時在結尾稍停，減輕接縫跳切感 */
  repeat?: number;
  repeatDelay?: number;
  /** 完整一輪結束後、淡出／重播前，停在結尾畫面的秒數 */
  endHoldSec?: number;
  /** 循環前把圖形淡回 idle（opacity），再由 t=0 reset 接上 */
  fadeOutBeforeRepeat?: boolean;
  /** hero 結尾的填色淡入；loading 可改色後仍開啟 */
  includeBackgroundFill?: boolean;
  logLabel?: string;
};

const STROKE_IDS = [
  ...CIRCLE_DRAW_ORDER,
  ...VERT_DRAW_CONFIG.map((c) => c.id),
  ...HOR_DRAW_ORDER,
  ...RECT_DRAW_ORDER,
  ...CROSS_DRAW_ORDER,
] as const;

/** Loading：描邊 ash-50、填色改 bg-card（不影響 hero 原 SVG） */
export function applyGridIconLoadingAppearance(graphic: Element) {
  for (const id of STROKE_IDS) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) p.setAttribute("stroke", "var(--color-ash-50)");
  }
  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (bg) {
    bg.setAttribute("fill", "var(--color-bg-card)");
    gsap.set(bg, { opacity: 0, visibility: "visible" });
  }
}

function queryPaths(graphic: Element, ids: readonly string[]): SVGPathElement[] {
  const paths: SVGPathElement[] = [];
  for (const id of ids) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) paths.push(p);
  }
  return paths;
}

function setStrokeHidden(path: SVGPathElement, offset: number) {
  const len = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: offset,
  });
  return len;
}

function resetCircleDash(paths: SVGPathElement[], lengths: number[]) {
  paths.forEach((p, i) => {
    gsap.set(p, {
      strokeDasharray: lengths[i],
      strokeDashoffset: -lengths[i],
    });
  });
}

function ensureVertPathDirection(
  path: SVGPathElement,
  growFrom: "top" | "bottom",
): void {
  const d = path.getAttribute("d") ?? "";
  const bottomToTop = /^M([\d.]+)\s+512\s*V\s*0\s*$/i.test(d.trim());
  const topToBottom = /^M([\d.]+)\s+0\s*V\s*512\s*$/i.test(d.trim());

  if (growFrom === "top" && bottomToTop) {
    const x = d.match(/^M([\d.]+)/)?.[1];
    if (x) path.setAttribute("d", `M${x} 0V512`);
  } else if (growFrom === "bottom" && topToBottom) {
    const x = d.match(/^M([\d.]+)/)?.[1];
    if (x) path.setAttribute("d", `M${x} 512V0`);
  }
}

function setVertLineHidden(path: SVGPathElement, growFrom: "top" | "bottom") {
  ensureVertPathDirection(path, growFrom);
  setStrokeHidden(path, path.getTotalLength());
}

function ensureHorPathDirection(
  path: SVGPathElement,
  growFrom: "left" | "right",
): void {
  const d = path.getAttribute("d") ?? "";
  const leftToRight = /^M0\s+([\d.]+)\s*H\s*512\s*$/i.test(d.trim());
  const rightToLeft = /^M512\s+([\d.]+)\s*H\s*0\s*$/i.test(d.trim());
  const y = d.match(/M(?:0|512)\s+([\d.]+)/)?.[1];

  if (!y) return;

  if (growFrom === "left" && !leftToRight) {
    path.setAttribute("d", `M0 ${y}H512`);
  } else if (growFrom === "right" && !rightToLeft) {
    path.setAttribute("d", `M512 ${y}H0`);
  }
}

function setHorLineHidden(path: SVGPathElement, growFrom: "left" | "right") {
  ensureHorPathDirection(path, growFrom);
  setStrokeHidden(path, path.getTotalLength());
}

/** 方形 path 改為順時針：上→右→下→左 */
function ensureRectClockwise(path: SVGPathElement): void {
  if (path.getAttribute("id") === "line-rect") {
    path.setAttribute("d", "M35 35H477V477H35V35Z");
  }
}

function setRectStrokeHidden(path: SVGPathElement) {
  ensureRectClockwise(path);
  const len = path.getTotalLength();
  const initialOffset = path.getAttribute("id") === "line-rect" ? len : -len;
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: initialOffset,
  });
}

function ensureCrossPathDirection(
  path: SVGPathElement,
  grow: "tr-bl" | "br-tl",
): void {
  const d = path.getAttribute("d") ?? "";
  if (grow === "tr-bl") {
    const trToBl = /^M478\s+34\s*L\s*34\s+478\s*$/i.test(d.trim());
    const blToTr = /^M34\s+478\s*L\s*478\s+34\s*$/i.test(d.trim());
    if (blToTr) path.setAttribute("d", "M478 34L34 478");
    else if (!trToBl) path.setAttribute("d", "M478 34L34 478");
  } else {
    const brToTl = /^M478\s+478\s*L\s*34\s+34\s*$/i.test(d.trim());
    const tlToBr = /^M34\s+34\s*L\s*478\s+478\s*$/i.test(d.trim());
    if (tlToBr) path.setAttribute("d", "M478 478L34 34");
    else if (!brToTl) path.setAttribute("d", "M478 478L34 34");
  }
}

function setCrossLineHidden(path: SVGPathElement, grow: "tr-bl" | "br-tl") {
  ensureCrossPathDirection(path, grow);
  setStrokeHidden(path, path.getTotalLength());
}

export function resetGridIconHidden(graphic: Element) {
  for (const { id, growFrom } of VERT_DRAW_CONFIG) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setVertLineHidden(p, growFrom);
  }
  for (const id of HOR_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setHorLineHidden(p, HOR_GROW[id]);
  }
  for (const id of RECT_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setRectStrokeHidden(p);
  }
  for (const id of CROSS_DRAW_ORDER) {
    const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
    if (p) setCrossLineHidden(p, CROSS_GROW[id]);
  }
  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (bg) gsap.set(bg, { opacity: 0 });
}

function showPathsComplete(paths: SVGPathElement[]) {
  for (const p of paths) {
    gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 });
  }
}

function addSequentialStrokeTweens(
  tl: gsap.core.Timeline,
  paths: SVGPathElement[],
  startSec: number,
  totalSec: number,
  ease: string,
  endOffset = 0,
) {
  if (paths.length === 0) return;
  const segmentSec = totalSec / paths.length;
  for (let i = 0; i < paths.length; i++) {
    tl.to(
      paths[i],
      {
        strokeDashoffset: endOffset,
        duration: segmentSec,
        ease,
      },
      i === 0 ? startSec : ">",
    );
  }
}

function warnMissing(logLabel: string, part: string) {
  if (import.meta.env.DEV) {
    console.warn(`[${logLabel}] Missing ${part}`);
  }
}

export function showGridIconComplete(
  graphic: Element,
  options: { includeBackgroundFill?: boolean } = {},
) {
  const { includeBackgroundFill = true } = options;
  showPathsComplete(queryPaths(graphic, STROKE_IDS));
  const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
  if (!bg) return;
  if (includeBackgroundFill) {
    gsap.set(bg, { opacity: 1, visibility: "visible" });
  } else {
    gsap.set(bg, { opacity: 0, visibility: "hidden" });
  }
}

export function buildGridIconTimeline(
  graphic: Element,
  options: BuildGridIconTimelineOptions = {},
): gsap.core.Timeline {
  const {
    levaSetValues,
    repeat = 0,
    repeatDelay = 0,
    endHoldSec = 0,
    fadeOutBeforeRepeat = false,
    includeBackgroundFill = true,
    logLabel = "GridIconTimeline",
  } = options;

  const tl = gsap.timeline({
    defaults: { ease: CIRCLE_EASE },
    repeat,
    repeatDelay,
  });

  const graphicEl = graphic as HTMLElement | SVGElement;
  // 先 reset 再亮起，避免 loop 接縫時完整圖形閃一幀
  tl.call(() => resetGridIconHidden(graphic), undefined, 0);
  tl.set(graphicEl, { opacity: 1 }, 0);

  const circlePaths = queryPaths(graphic, CIRCLE_DRAW_ORDER);
  if (circlePaths.length === CIRCLE_DRAW_ORDER.length) {
    const circleLengths = circlePaths.map((p) => p.getTotalLength());
    tl.call(() => resetCircleDash(circlePaths, circleLengths), undefined, 0);
    addSequentialStrokeTweens(
      tl,
      circlePaths,
      0,
      CIRCLE_DRAW_TOTAL_SEC,
      CIRCLE_EASE,
      0,
    );
  } else {
    warnMissing(logLabel, "circle paths");
  }

  const vertPaths = queryPaths(
    graphic,
    VERT_DRAW_CONFIG.map((c) => c.id),
  );
  if (vertPaths.length === VERT_DRAW_CONFIG.length) {
    tl.call(() => {
      for (const { id, growFrom } of VERT_DRAW_CONFIG) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setVertLineHidden(p, growFrom);
      }
    }, undefined, VERT_START_SEC);
    addSequentialStrokeTweens(
      tl,
      vertPaths,
      VERT_START_SEC,
      VERT_DRAW_TOTAL_SEC,
      VERT_EASE,
      0,
    );
  } else {
    warnMissing(logLabel, "vert paths");
  }

  const horPaths = queryPaths(graphic, HOR_DRAW_ORDER);
  if (horPaths.length === HOR_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of HOR_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setHorLineHidden(p, HOR_GROW[id]);
      }
    }, undefined, HOR_START_SEC);
    addSequentialStrokeTweens(
      tl,
      horPaths,
      HOR_START_SEC,
      HOR_DRAW_TOTAL_SEC,
      HOR_EASE,
      0,
    );
  } else {
    warnMissing(logLabel, "hor paths");
  }

  const rectPaths = queryPaths(graphic, RECT_DRAW_ORDER);
  if (rectPaths.length === RECT_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of RECT_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setRectStrokeHidden(p);
      }
    }, undefined, RECT_START_SEC);
    addSequentialStrokeTweens(
      tl,
      rectPaths,
      RECT_START_SEC,
      RECT_DRAW_TOTAL_SEC,
      RECT_EASE,
      0,
    );
  } else {
    warnMissing(logLabel, "rect paths");
  }

  const crossPaths = queryPaths(graphic, CROSS_DRAW_ORDER);
  if (crossPaths.length === CROSS_DRAW_ORDER.length) {
    tl.call(() => {
      for (const id of CROSS_DRAW_ORDER) {
        const p = graphic.querySelector<SVGPathElement>(`[id="${id}"]`);
        if (p) setCrossLineHidden(p, CROSS_GROW[id]);
      }
    }, undefined, CROSS_START_SEC);
    addSequentialStrokeTweens(
      tl,
      crossPaths,
      CROSS_START_SEC,
      CROSS_DRAW_TOTAL_SEC,
      CROSS_EASE,
      0,
    );
  } else {
    warnMissing(logLabel, "cross paths");
  }

  if (includeBackgroundFill) {
    const bg = graphic.querySelector<SVGPathElement>("#bg-rounded-rect");
    if (bg) {
      tl.fromTo(
        bg,
        { opacity: 0 },
        { opacity: 1, duration: BG_DURATION_SEC, ease: BG_EASE },
        BG_START_SEC,
      );
    }
  }

  if (endHoldSec > 0) {
    // 空 tween：停在完整結尾畫面
    tl.to({}, { duration: endHoldSec });
  }

  if (fadeOutBeforeRepeat && repeat !== 0) {
    tl.to(graphicEl, { opacity: 0, duration: 0.25, ease: "power1.inOut" });
  }

  if (levaSetValues) {
    tl.eventCallback("onUpdate", () => {
      levaSetValues({ progress: tl.progress() });
    });
  }

  return tl;
}

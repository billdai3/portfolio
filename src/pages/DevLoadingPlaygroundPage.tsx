import { useCallback, useEffect, useRef, useState } from "react";
import { button, Leva, useControls } from "leva";

import GridIconLoading, {
  GRID_ICON_LOADING_SIZE_PX,
  type GridIconLoadingHandle,
} from "../components/GridIconLoading";

/** 與 GSAP `progress()` 接近時視為 Leva 回寫，避免再 `seek` 打斷播放 */
const PROGRESS_SEEK_EPS = 0.002;

export default function DevLoadingPlaygroundPage() {
  const timelineRef = useRef<GridIconLoadingHandle | null>(null);
  const suppressSeekFromTimeline = useRef(false);
  const userScrubbingRef = useRef(false);
  const fakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fakeDelaySecRef = useRef(2);
  const [visible, setVisible] = useState(true);
  const [instanceKey, setInstanceKey] = useState(0);

  const { sizePx, timeScale, loop, fadeOutBeforeRepeat, fakeDelaySec } =
    useControls("Loading", {
      sizePx: {
        value: GRID_ICON_LOADING_SIZE_PX,
        min: 48,
        max: 200,
        step: 4,
        label: "Size (px)",
      },
      timeScale: {
        value: 1.3,
        min: 0.5,
        max: 3,
        step: 0.1,
        label: "Time scale",
      },
      loop: { value: true, label: "Loop" },
      fadeOutBeforeRepeat: { value: true, label: "Fade before repeat" },
      fakeDelaySec: {
        value: 2,
        min: 0.5,
        max: 5,
        step: 0.5,
        label: "Fake delay (s)",
      },
    });

  const [, setProgressControls] = useControls("Timeline", () => ({
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
      label: "Progress",
      onEditStart: () => {
        userScrubbingRef.current = true;
        timelineRef.current?.pause();
      },
      onEditEnd: () => {
        userScrubbingRef.current = false;
        timelineRef.current?.play();
      },
      onChange: (v: number) => {
        if (suppressSeekFromTimeline.current) return;
        if (!userScrubbingRef.current) return;
        const api = timelineRef.current;
        if (!api) return;
        if (Math.abs(v - api.getProgress()) < PROGRESS_SEEK_EPS) return;
        api.seek(v);
      },
    },
    Restart: button(() => {
      setVisible(true);
      timelineRef.current?.restart();
    }),
    "Simulate load end": button(() => {
      setVisible(false);
    }),
    "Show loading again": button(() => {
      setVisible(true);
      setInstanceKey((k) => k + 1);
    }),
    "Fake delayed load": button(() => {
      if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
      setVisible(true);
      setInstanceKey((k) => k + 1);
      fakeTimerRef.current = setTimeout(() => {
        setVisible(false);
        fakeTimerRef.current = null;
      }, fakeDelaySecRef.current * 1000);
    }),
  }));

  useEffect(() => {
    fakeDelaySecRef.current = fakeDelaySec;
  }, [fakeDelaySec]);

  useEffect(() => {
    return () => {
      if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
    };
  }, []);

  const levaSetWrapped = useCallback(
    (patch: Record<string, unknown>) => {
      if (userScrubbingRef.current) return;
      if ("progress" in patch && typeof patch.progress === "number") {
        suppressSeekFromTimeline.current = true;
        setProgressControls(patch);
        queueMicrotask(() => {
          suppressSeekFromTimeline.current = false;
        });
      } else {
        setProgressControls(patch);
      }
    },
    [setProgressControls],
  );

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-bg-page px-6 py-10">
      <Leva titleBar={{ title: "Loading tweaks", drag: true, filter: false }} />
      <p className="max-w-md text-center text-sm text-text-secondary">
        <code className="text-text-primary">/dev/loading</code>
        {" — "}
        真實 <code className="text-text-primary">GridIconLoading</code>
        （描邊 ash-50、填色 bg-card、預設 72px）；調尺寸不會中斷動畫
      </p>
      {visible ? (
        // 尺寸包在外層：改 size 只動 wrapper，不動灌了 SVG 的節點
        <div style={{ width: sizePx, height: sizePx }} className="shrink-0">
          <GridIconLoading
            key={`${instanceKey}-${loop}-${fadeOutBeforeRepeat}`}
            className="h-full w-full"
            loop={loop}
            timeScale={timeScale}
            fadeOutBeforeRepeat={fadeOutBeforeRepeat}
            timelineRef={timelineRef}
            levaSetValues={levaSetWrapped}
          />
        </div>
      ) : (
        <p className="text-sm text-text-secondary">載入結束（元件已卸載）</p>
      )}
    </div>
  );
}

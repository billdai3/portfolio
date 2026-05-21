import { useCallback, useRef } from 'react'
import { button, Leva, useControls } from 'leva'

import HeroAnimation, {
  type GridIconTimelineHandle,
} from '../components/HeroAnimation'

/** 與 GSAP `progress()` 接近時視為 Leva 回寫，避免再 `seek` 打斷播放 */
const PROGRESS_SEEK_EPS = 0.002

export default function DevGsapPlaygroundPage() {
  const gridIconRef = useRef<GridIconTimelineHandle | null>(null)
  const suppressSeekFromTimeline = useRef(false)

  const [, set] = useControls(() => ({
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
      label: 'Progress',
      onChange: (v: number) => {
        if (suppressSeekFromTimeline.current) return
        const api = gridIconRef.current
        if (!api) return
        if (Math.abs(v - api.getProgress()) < PROGRESS_SEEK_EPS) return
        api.seek(v)
      },
    },
    Reset: button(() => {
      gridIconRef.current?.restart()
    }),
  }))

  const levaSetWrapped = useCallback(
    (patch: Record<string, unknown>) => {
      if ('progress' in patch && typeof patch.progress === 'number') {
        suppressSeekFromTimeline.current = true
        set(patch)
        queueMicrotask(() => {
          suppressSeekFromTimeline.current = false
        })
      } else {
        set(patch)
      }
    },
    [set],
  )

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-ash-600 py-10">
      <Leva titleBar={{ title: 'GSAP tweaks', drag: true, filter: false }} />
      <HeroAnimation
        className="h-64 w-64 max-w-full shrink-0"
        gridIconTimelineRef={gridIconRef}
        levaSetValues={levaSetWrapped}
      />
    </div>
  )
}

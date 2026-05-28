import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import skillWorkflowSvg from '../assets/skill-workflow.svg?raw'

/** 給 Leva scrub / Reset 用（僅 dev 頁）。 */
export type SkillWorkflowTimelineHandle = {
  seek: (progress: number) => void
  getProgress: () => number
  restart: () => void
}

type LevaSetValues = (values: Record<string, unknown>) => void

type SkillWorkflowAnimationProps = {
  className?: string
  levaSetValues?: LevaSetValues
  timelineRef?: RefObject<SkillWorkflowTimelineHandle | null>
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export default function SkillWorkflowAnimation({
  className,
  levaSetValues,
  timelineRef,
}: SkillWorkflowAnimationProps) {
  const progressRef = useRef(0)

  useEffect(() => {
    if (timelineRef) {
      timelineRef.current = {
        seek: (progress: number) => {
          const next = clamp01(progress)
          progressRef.current = next
          levaSetValues?.({ progress: next })
        },
        getProgress: () => progressRef.current,
        restart: () => {
          progressRef.current = 0
          levaSetValues?.({ progress: 0 })
        },
      }
    }

    levaSetValues?.({ progress: 0 })

    return () => {
      if (timelineRef) timelineRef.current = null
    }
  }, [levaSetValues, timelineRef])

  return (
    <div
      className={[
        '[&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: skillWorkflowSvg }}
    />
  )
}

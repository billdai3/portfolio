import { useId, type ReactNode } from "react";

// Normalized from src/assets/shapes/squircle.svg (480×360 viewBox) for objectBoundingBox clipping.
const SQUIRCLE_PATH =
  "M0.083333 0.083333C0.09375 0.0722228 0.166667 0 0.5 0C0.833333 0 0.90625 0.0722228 0.916667 0.083333C0.927083 0.0944444 1 0.166667 1 0.5C1 0.833333 0.927083 0.905556 0.916667 0.916667C0.90625 0.927778 0.833333 1 0.5 1C0.166667 1 0.09375 0.927778 0.083333 0.916667C0.0729167 0.905556 0 0.833333 0 0.5C0 0.166667 0.0729167 0.0944444 0.083333 0.083333Z";

type SquircleClipProps = {
  children?: ReactNode;
  className?: string;
};

export default function SquircleClip({
  children,
  className = "",
}: SquircleClipProps) {
  const clipId = useId();

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={SQUIRCLE_PATH} />
          </clipPath>
        </defs>
      </svg>
      <div
        className={`aspect-4/3 w-full ${className}`.trim()}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children}
      </div>
    </>
  );
}

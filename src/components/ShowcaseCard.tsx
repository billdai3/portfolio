import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SquircleClip from "./SquircleClip";
import {
  ShowcaseCardImageSkeleton,
  ShowcaseCardTextSkeleton,
} from "./ShowcaseCardSkeleton";

export type ShowcaseItem = {
  title: string;
  tag: string;
  href?: string;
};

type ShowcaseCardProps = {
  item: ShowcaseItem;
  /** When true, shows rainbow stripe + text skeleton placeholders. */
  loading?: boolean;
  /** Preview image; shown in SquircleClip when not loading. */
  image?: string;
};

const SHORT_TAG_ROTATION = -20;
const LONG_TAG_ROTATION = 0;
const TAG_BASE_WIDTH = 56;
const TAG_WIDTH_RANGE = 96;
const SHORT_TAG_OFFSET_X = -2;
const LONG_TAG_OFFSET_X = 5;
const SHORT_TAG_OFFSET_Y = -2;
const LONG_TAG_OFFSET_Y = -5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getTagTransform(width: number) {
  const normalized = clamp((width - TAG_BASE_WIDTH) / TAG_WIDTH_RANGE, 0, 1);
  return {
    rotation: lerp(SHORT_TAG_ROTATION, LONG_TAG_ROTATION, normalized),
    offsetX: lerp(SHORT_TAG_OFFSET_X, LONG_TAG_OFFSET_X, normalized),
    offsetY: lerp(SHORT_TAG_OFFSET_Y, LONG_TAG_OFFSET_Y, normalized),
  };
}

function ShowcaseCardTag({ tag }: { tag: string }) {
  const tagRef = useRef<HTMLSpanElement>(null);
  const [transform, setTransform] = useState(() => ({
    rotation: SHORT_TAG_ROTATION,
    offsetX: SHORT_TAG_OFFSET_X,
    offsetY: SHORT_TAG_OFFSET_Y,
  }));

  useLayoutEffect(() => {
    const element = tagRef.current;

    if (!element) {
      return;
    }

    const updateTransform = () => {
      const nextTransform = getTagTransform(element.offsetWidth);

      setTransform((currentTransform) => {
        if (
          currentTransform.rotation === nextTransform.rotation &&
          currentTransform.offsetX === nextTransform.offsetX &&
          currentTransform.offsetY === nextTransform.offsetY
        ) {
          return currentTransform;
        }

        return nextTransform;
      });
    };

    updateTransform();

    const resizeObserver = new ResizeObserver(updateTransform);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [tag]);

  return (
    <div className="pointer-events-none absolute top-7 left-7">
      <span
        ref={tagRef}
        className="inline-flex max-w-32 origin-left whitespace-nowrap rounded-full bg-ash-700 px-3 py-1 text-xs font-semibold tracking-wide text-text-secondary backdrop-blur-sm transition-[transform,background-color,color] duration-300 ease-out group-hover:bg-brand group-hover:text-ash-900"
        style={{
          transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) rotate(${transform.rotation}deg)`,
        }}
      >
        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
          {tag}
        </span>
      </span>
    </div>
  );
}

function ShowcaseCardCornerDecoration() {
  return (
    <div
      className="relative size-7 shrink-0 rounded-full bg-ash-700"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-4 -rotate-45 rounded-full bg-ash-800 transition-transform duration-300 ease-out group-hover:rotate-45 [clip-path:inset(0_0_50%_0)]" />
      </div>
    </div>
  );
}

export default function ShowcaseCard({
  item,
  loading = false,
  image,
}: ShowcaseCardProps) {
  const inner = (
    <>
      <SquircleClip className="mb-3 overflow-hidden bg-ash-700">
        <div className="relative h-full w-full">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
            />
          ) : null}
          {!loading ? <ShowcaseCardTag tag={item.tag} /> : null}
          <div
            className={`showcase-image-skeleton-fade absolute inset-0 transition-opacity duration-300 ease-out ${
              loading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!loading}
          >
            <ShowcaseCardImageSkeleton />
          </div>
        </div>
      </SquircleClip>
      <div className="flex items-center gap-1.5">
        <ShowcaseCardCornerDecoration />
        {loading ? (
          <ShowcaseCardTextSkeleton />
        ) : (
          <div className="flex min-h-12 min-w-0 flex-1 items-center text-center">
            <h3
              className="w-full overflow-hidden text-center leading-tight text-lg font-extrabold tracking-tight text-text-secondary transition-colors duration-300 ease-out group-hover:text-text-primary"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {item.title}
            </h3>
          </div>
        )}
        <ShowcaseCardCornerDecoration />
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link
        to={item.href}
        className="group block rounded-2xl bg-bg-card p-5 transition-colors"
        aria-busy={loading || undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="group rounded-2xl bg-bg-card p-5"
      aria-busy={loading || undefined}
    >
      {inner}
    </div>
  );
}

import { Lock } from "lucide-react";
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
  isLocked?: boolean;
};

type ShowcaseCardProps = {
  item: ShowcaseItem;
  /** When true, shows rainbow stripe + text skeleton placeholders. */
  loading?: boolean;
  /** Preview image; shown in SquircleClip when not loading. */
  image?: string;
};

function ShowcaseCardLockTag() {
  return (
    <div
      className="pointer-events-none absolute top-[10%] left-[10%]"
      aria-label="Locked project"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-ash-700 text-text-secondary backdrop-blur-sm transition-[background-color,color] duration-300 ease-out group-hover:bg-brand group-hover:text-ash-900">
        <Lock className="size-5" strokeWidth={4} aria-hidden />
      </span>
    </div>
  );
}

function ShowcaseCardTitleBar({ title }: { title: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-bg-page/50 px-5 py-3 backdrop-blur-[2px]">
      <h3
        className="overflow-hidden text-center text-lg font-extrabold leading-tight tracking-tight text-ash-50 group-hover:text-accent"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

const FOOTER_BAR_HEIGHTS = [45, 70, 90, 100, 90, 70, 45] as const;

function ShowcaseCardFooterBars() {
  return (
    <div
      className="flex h-full min-w-0 flex-1 items-center justify-center gap-2"
      aria-hidden
    >
      {FOOTER_BAR_HEIGHTS.map((height, index) => (
        <div
          key={index}
          className="w-2 rounded-full bg-ash-700"
          style={{ height: `${height}%` }}
        />
      ))}
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
          {!loading ? <ShowcaseCardTitleBar title={item.title} /> : null}
          {!loading && item.isLocked ? <ShowcaseCardLockTag /> : null}
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
      <div className="flex h-7 items-center gap-1.5">
        <ShowcaseCardCornerDecoration />
        {loading ? <ShowcaseCardTextSkeleton /> : <ShowcaseCardFooterBars />}
        <ShowcaseCardCornerDecoration />
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link
        to={item.href}
        className="group block rounded-[8%] bg-bg-card p-5 transition-colors"
        aria-busy={loading || undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="group rounded-[8%] bg-bg-card p-5"
      aria-busy={loading || undefined}
    >
      {inner}
    </div>
  );
}

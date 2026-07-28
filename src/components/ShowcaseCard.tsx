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
          {!loading ? (
            <div className="pointer-events-none absolute top-6 left-6">
              <span className="inline-flex origin-left -rotate-20 rounded-full bg-ash-700 px-3 py-1 text-xs font-semibold tracking-wide text-text-secondary backdrop-blur-sm transition-colors duration-300 ease-out group-hover:bg-brand group-hover:text-ash-900">
                {item.tag}
              </span>
            </div>
          ) : null}
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

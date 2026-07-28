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
      className="relative size-9 shrink-0 rounded-full bg-ash-700"
      aria-hidden
    >
      <div className="absolute inset-1.5 flex items-center justify-center rounded-full bg-ash-800">
        <div className="h-1.5 w-4 rotate-45 rounded-full bg-ash-700" />
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
            <img src={image} alt="" className="h-full w-full object-cover" />
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
          <div className="min-w-0 flex-1 text-center">
            <p className="text-sm font-normal tracking-wider text-text-muted">
              {item.tag}
            </p>
            <h3 className="text-lg font-extrabold tracking-tight text-text-primary transition-colors group-hover:text-accent">
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
      className="rounded-2xl bg-bg-card p-5"
      aria-busy={loading || undefined}
    >
      {inner}
    </div>
  );
}

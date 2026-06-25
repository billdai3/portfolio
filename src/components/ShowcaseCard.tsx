import { Link } from "react-router-dom";
import SquircleClip from "./SquircleClip";

export type ShowcaseItem = {
  title: string;
  tag: string;
  href?: string;
};

export type ShowcaseCardVariant = "on-section" | "on-section-alt";

type ShowcaseCardProps = {
  item: ShowcaseItem;
  variant: ShowcaseCardVariant;
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

export default function ShowcaseCard({ item, variant }: ShowcaseCardProps) {
  const cardBg = variant === "on-section" ? "bg-bg-card" : "bg-bg-card-alt";

  const inner = (
    <>
      <SquircleClip className="mb-3 bg-ash-700" />
      <div className="flex items-center gap-1.5">
        <ShowcaseCardCornerDecoration />
        <div className="min-w-0 flex-1 text-center">
          <p className="text-sm font-normal tracking-wider text-text-muted">
            {item.tag}
          </p>
          <h3 className="text-lg font-extrabold tracking-tight text-text-primary">
            {item.title}
          </h3>
        </div>
        <ShowcaseCardCornerDecoration />
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link
        to={item.href}
        className={`block rounded-2xl ${cardBg} p-5 transition`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`rounded-2xl ${cardBg} p-5`}>{inner}</div>;
}

import { Link } from "react-router-dom";

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

export default function ShowcaseCard({ item, variant }: ShowcaseCardProps) {
  const cardBg =
    variant === "on-section" ? "bg-bg-card" : "bg-bg-card-alt";

  const inner = (
    <>
      <div className="mb-5 aspect-16/10 rounded-xl bg-ash-600" />
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {item.tag}
      </p>
      <h3 className="mt-1.5 text-lg font-medium tracking-tight text-text-primary">
        {item.title}
      </h3>
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

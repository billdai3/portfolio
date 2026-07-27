import { useEffect, useState } from "react";
import ShowcaseCard, { type ShowcaseItem } from "./ShowcaseCard";

type ShowcaseCardDelayedProps = {
  item: ShowcaseItem;
  image?: string;
  delayMs?: number;
};

export default function ShowcaseCardDelayed({
  item,
  image,
  delayMs = 500,
}: ShowcaseCardDelayedProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return <ShowcaseCard item={item} image={image} loading={loading} />;
}

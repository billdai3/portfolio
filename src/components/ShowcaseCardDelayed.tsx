import { useEffect, useState } from "react";
import ShowcaseCard, { type ShowcaseItem } from "./ShowcaseCard";

type ShowcaseCardDelayedProps = {
  item: ShowcaseItem;
  image?: string;
  video?: string;
  delayMs?: number;
};

export default function ShowcaseCardDelayed({
  item,
  image,
  video,
  delayMs = 200,
}: ShowcaseCardDelayedProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return (
    <ShowcaseCard item={item} image={image} video={video} loading={loading} />
  );
}

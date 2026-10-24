import { useCallback, useEffect, useState } from "react";
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
  const [minElapsed, setMinElapsed] = useState(false);
  const [imageSettled, setImageSettled] = useState(!image);
  const [prevImage, setPrevImage] = useState(image);
  const [prevDelayMs, setPrevDelayMs] = useState(delayMs);

  // Reset gates when cover URL or min delay changes (avoid setState in effect).
  if (image !== prevImage || delayMs !== prevDelayMs) {
    setPrevImage(image);
    setPrevDelayMs(delayMs);
    setMinElapsed(false);
    setImageSettled(!image);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setMinElapsed(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, image]);

  const handleImageSettled = useCallback(() => {
    setImageSettled(true);
  }, []);

  const loading = !(minElapsed && imageSettled);

  return (
    <ShowcaseCard
      item={item}
      image={image}
      video={video}
      loading={loading}
      onImageSettled={image ? handleImageSettled : undefined}
    />
  );
}

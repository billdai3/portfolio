const STRIPE_COUNT = 7;

export function ShowcaseCardImageSkeleton() {
  return (
    <div className="showcase-skeleton-stripes flex h-full w-full" aria-hidden>
      {Array.from({ length: STRIPE_COUNT }, (_, index) => (
        <div key={index} className="showcase-skeleton-breathe flex-1" />
      ))}
    </div>
  );
}

export function ShowcaseCardTextSkeleton() {
  return (
    <div
      className="showcase-skeleton-text min-w-0 flex-1 space-y-2 text-center"
      aria-hidden
    >
      <div className="showcase-skeleton-breathe mx-auto h-4 w-20 rounded-full" />
      <div className="showcase-skeleton-breathe mx-auto h-6 w-32 max-w-full rounded-lg" />
    </div>
  );
}

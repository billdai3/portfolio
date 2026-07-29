import {
  Children,
  isValidElement,
  useCallback,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import ImageLightbox, { type LightboxImage } from "./ImageLightbox";

export type MediaWidth = "default" | "wide" | "full";

export type MediaProps = {
  src: string;
  alt?: string;
  caption?: string;
  width?: MediaWidth;
};

const widthClassName: Record<MediaWidth, string> = {
  default: "w-full",
  wide: "work-media--wide",
  full: "work-media--full",
};

function resolveSrc(src: string | { src?: string } | undefined): string {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && typeof src.src === "string") {
    return src.src;
  }
  return "";
}

export function Media({
  src,
  alt = "",
  caption,
  width = "default",
}: MediaProps) {
  const [open, setOpen] = useState(false);
  const imageSrc = resolveSrc(src);

  if (!imageSrc) return null;

  return (
    <>
      <figure className={`work-media mb-8 ${widthClassName[width]}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt ? `View larger: ${alt}` : "View larger image"}
        >
          <img
            src={imageSrc}
            alt={alt}
            className="block w-full object-cover transition duration-300 group-hover:opacity-95"
          />
        </button>
        {caption ? (
          <figcaption className="mt-2 text-sm leading-relaxed text-text-secondary text-center">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {open ? (
        <ImageLightbox
          images={[{ src: imageSrc, alt }]}
          index={0}
          onClose={() => setOpen(false)}
          onIndexChange={() => undefined}
        />
      ) : null}
    </>
  );
}

function isMediaElement(child: ReactNode): child is ReactElement<MediaProps> {
  if (!isValidElement(child)) return false;
  const props = child.props as Partial<MediaProps>;
  return typeof props.src === "string" || typeof props.src === "object";
}

type CarouselProps = {
  children: ReactNode;
  caption?: string;
};

export function Carousel({ children, caption }: CarouselProps) {
  const slides = Children.toArray(children)
    .filter(isMediaElement)
    .map((child) => {
      const src = resolveSrc(child.props.src);
      return {
        src,
        alt: child.props.alt ?? "",
        caption: child.props.caption,
      };
    })
    .filter((slide) => Boolean(slide.src));

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex = slides.length === 0 ? 0 : index % slides.length;
  const current = slides[safeIndex];

  const goPrev = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const lightboxImages: LightboxImage[] = slides.map(({ src, alt }) => ({
    src,
    alt,
  }));

  if (!current) return null;

  return (
    <>
      <figure className="work-media mb-8 w-full">
        <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              aria-label={
                current.alt
                  ? `View larger: ${current.alt}`
                  : "View larger image"
              }
            >
              <img
                src={current.src}
                alt={current.alt}
                className="block aspect-16/10 w-full object-cover transition duration-300 group-hover:opacity-95"
              />
            </button>

            {slides.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-bg-card/85 text-text-secondary transition-colors hover:text-text-primary"
                  aria-label="Previous slide"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-bg-card/85 text-text-secondary transition-colors hover:text-text-primary"
                  aria-label="Next slide"
                >
                  →
                </button>
                <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {slides.map((_, i) => (
                    <span
                      key={i}
                      className={[
                        "size-1.5 rounded-full",
                        i === safeIndex ? "bg-accent" : "bg-ash-500",
                      ].join(" ")}
                      aria-hidden
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
        {caption || current.caption ? (
          <figcaption className="mt-2 flex items-baseline justify-between gap-4 text-sm leading-relaxed text-text-muted">
            <span>{caption ?? current.caption}</span>
            {slides.length > 1 ? (
              <span className="shrink-0 tabular-nums">
                {safeIndex + 1} / {slides.length}
              </span>
            ) : null}
          </figcaption>
        ) : slides.length > 1 ? (
          <figcaption className="mt-2 text-right text-sm tabular-nums text-text-muted">
            {safeIndex + 1} / {slides.length}
          </figcaption>
        ) : null}
      </figure>

      {lightboxOpen ? (
        <ImageLightbox
          images={lightboxImages}
          index={safeIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setIndex}
        />
      ) : null}
    </>
  );
}

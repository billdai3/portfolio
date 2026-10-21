import {
  Children,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type TransitionEvent,
} from "react";
import ChevronIcon from "@/components/icons/ChevronIcon";
import ComparisonIcon from "@/components/icons/ComparisonIcon";
import { resolveLocalContentAsset } from "@/features/mdx/resolve-local-content-asset";
import ImageLightbox from "./ImageLightbox";

export type MediaWidth = "default" | "wide" | "page";
export type MediaFit = "cover" | "contain";
export type MediaType = "image" | "video";

export type MediaProps = {
  src: string;
  alt?: string;
  caption?: string;
  width?: MediaWidth;
  ratio?: string;
  fit?: MediaFit;
  type?: MediaType;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

const widthClassName: Record<MediaWidth, string> = {
  default: "w-full",
  wide: "work-media--wide",
  page: "work-media--page",
};
const DEFAULT_MEDIA_RATIO = "16 / 10";

function resolveSrc(src: string | { src?: string } | undefined): string {
  if (typeof src === "string") return resolveLocalContentAsset(src);
  if (src && typeof src === "object" && typeof src.src === "string") {
    return resolveLocalContentAsset(src.src);
  }
  return "";
}

type MediaImageProps = {
  src: string;
  alt: string;
  ratio?: string;
  fit?: MediaFit;
  loading?: "eager" | "lazy";
  hoverClassName?: string;
  /** Fill a sized parent instead of driving layout via aspect-ratio. */
  fill?: boolean;
};

function MediaImage({
  src,
  alt,
  ratio = DEFAULT_MEDIA_RATIO,
  fit = "cover",
  loading = "lazy",
  hoverClassName = "group-hover:opacity-95",
  fill = false,
}: MediaImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  return (
    <div
      className={[
        "relative overflow-hidden bg-bg-card",
        fill ? "h-full w-full" : "w-full",
      ].join(" ")}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoadedSrc(src)}
        className={[
          "absolute inset-0 h-full w-full transition-opacity duration-300",
          hoverClassName,
          fit === "contain" ? "object-contain" : "object-cover",
          isLoaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        className={`media-image-placeholder-fade absolute inset-0 transition-opacity duration-300 ${
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden
      >
        <div className="media-image-skeleton showcase-skeleton-breathe h-full w-full" />
      </div>
    </div>
  );
}

type MediaVideoProps = {
  src: string;
  alt: string;
  ratio?: string;
  fit?: MediaFit;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

function MediaVideo({
  src,
  alt,
  ratio = DEFAULT_MEDIA_RATIO,
  fit = "cover",
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}: MediaVideoProps) {
  const posterSrc = resolveSrc(poster);

  return (
    <div
      className="relative w-full overflow-hidden bg-bg-card"
      style={{ aspectRatio: ratio }}
    >
      <video
        src={src}
        poster={posterSrc || undefined}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        aria-label={alt || undefined}
        className={[
          "absolute inset-0 h-full w-full",
          fit === "contain" ? "object-contain" : "object-cover",
        ].join(" ")}
      />
    </div>
  );
}

function MediaCaption({ caption }: { caption?: string }) {
  if (!caption) return null;
  return (
    <figcaption className="mt-2 text-sm leading-relaxed text-center text-text-secondary hover:text-text-primary transition-colors duration-150">
      {caption}
    </figcaption>
  );
}

export function Media({
  src,
  alt = "",
  caption,
  width = "default",
  ratio = DEFAULT_MEDIA_RATIO,
  fit = "cover",
  type = "image",
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}: MediaProps) {
  const [open, setOpen] = useState(false);
  const mediaSrc = resolveSrc(src);

  if (!mediaSrc) return null;

  if (type === "video") {
    return (
      <figure className={`work-media mb-8 ${widthClassName[width]}`}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-bg-card">
          <MediaVideo
            src={mediaSrc}
            alt={alt}
            ratio={ratio}
            fit={fit}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
          />
        </div>
        <MediaCaption caption={caption} />
      </figure>
    );
  }

  return (
    <>
      <figure className={`work-media mb-8 ${widthClassName[width]}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={alt ? `View larger: ${alt}` : "View larger image"}
        >
          <MediaImage src={mediaSrc} alt={alt} ratio={ratio} fit={fit} />
        </button>
        <MediaCaption caption={caption} />
      </figure>
      {open ? (
        <ImageLightbox
          src={mediaSrc}
          alt={alt}
          onClose={() => setOpen(false)}
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
  width?: MediaWidth;
};

const CAROUSEL_PUSH_MS = 300;

export function Carousel({
  children,
  caption,
  width = "default",
}: CarouselProps) {
  const slides = Children.toArray(children)
    .filter(isMediaElement)
    .map((child) => {
      const src = resolveSrc(child.props.src);
      return {
        src,
        alt: child.props.alt ?? "",
        caption: child.props.caption,
        ratio: child.props.ratio,
        fit: child.props.fit ?? "cover",
      };
    })
    .filter((slide) => Boolean(slide.src));

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shift, setShift] = useState(false);
  const animatingRef = useRef(false);

  const safeIndex = slides.length === 0 ? 0 : index % slides.length;
  const current = slides[safeIndex];
  const outgoing =
    outgoingIndex !== null ? slides[outgoingIndex % slides.length] : null;
  const isPair = outgoing !== null && isAnimating;

  const viewportRatio =
    (outgoing?.ratio ?? current?.ratio) || DEFAULT_MEDIA_RATIO;

  const finishAnimation = useCallback(() => {
    animatingRef.current = false;
    setIsAnimating(false);
    setOutgoingIndex(null);
    setShift(false);
  }, []);

  const goPrev = useCallback(() => {
    if (animatingRef.current || slides.length < 2) return;
    animatingRef.current = true;
    setDirection(-1);
    setOutgoingIndex(safeIndex);
    setShift(false);
    setIsAnimating(true);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [safeIndex, slides.length]);

  const goNext = useCallback(() => {
    if (animatingRef.current || slides.length < 2) return;
    animatingRef.current = true;
    setDirection(1);
    setOutgoingIndex(safeIndex);
    setShift(false);
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % slides.length);
  }, [safeIndex, slides.length]);

  useLayoutEffect(() => {
    if (!isAnimating || outgoingIndex === null) return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setShift(true));
    });
    const timeout = window.setTimeout(finishAnimation, CAROUSEL_PUSH_MS + 80);
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      window.clearTimeout(timeout);
    };
  }, [finishAnimation, isAnimating, outgoingIndex]);

  const onTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform") return;
      if (event.target !== event.currentTarget) return;
      finishAnimation();
    },
    [finishAnimation],
  );

  if (!current) return null;

  const trackTransform = !isPair
    ? "translateX(0%)"
    : direction === 1
      ? shift
        ? "translateX(-50%)"
        : "translateX(0%)"
      : shift
        ? "translateX(0%)"
        : "translateX(-50%)";

  const orderedSlides = !isPair
    ? [{ slide: current, key: safeIndex }]
    : direction === 1
      ? [
          { slide: outgoing!, key: outgoingIndex! },
          { slide: current, key: safeIndex },
        ]
      : [
          { slide: current, key: safeIndex },
          { slide: outgoing!, key: outgoingIndex! },
        ];

  return (
    <>
      <figure className={`work-media mb-8 ${widthClassName[width]}`}>
        <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card">
          <div
            className="group relative overflow-hidden"
            style={{ aspectRatio: viewportRatio }}
          >
            <div
              className="absolute inset-y-0 left-0 flex h-full"
              style={{
                width: isPair ? "200%" : "100%",
                transform: trackTransform,
                transitionProperty: isPair && shift ? "transform" : "none",
                transitionDuration:
                  isPair && shift ? `${CAROUSEL_PUSH_MS}ms` : "0ms",
                transitionTimingFunction: "ease-out",
              }}
              onTransitionEnd={onTrackTransitionEnd}
            >
              {orderedSlides.map(({ slide, key }) => (
                <div
                  key={key}
                  className="h-full shrink-0"
                  style={{ width: isPair ? "50%" : "100%" }}
                >
                  <MediaImage
                    src={slide.src}
                    alt={slide.alt}
                    ratio={slide.ratio}
                    fit={slide.fit}
                    loading="eager"
                    fill
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 z-1 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              aria-label={
                current.alt
                  ? `View larger: ${current.alt}`
                  : "View larger image"
              }
            />

            {slides.length > 1 ? (
              <>
                <span
                  className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-bg-card/80 px-3 py-1 text-xs tabular-nums text-text-primary backdrop-blur-sm"
                  aria-hidden
                >
                  {safeIndex + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={isAnimating}
                  className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ash-50/10 text-text-secondary transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Previous slide"
                >
                  <ChevronIcon direction="left" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={isAnimating}
                  className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ash-50/10 text-text-secondary transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Next slide"
                >
                  <ChevronIcon direction="right" className="size-5" />
                </button>
                <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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
          <figcaption className="mt-2 text-sm leading-relaxed text-center text-text-secondary hover:text-text-primary transition-colors duration-150">
            {caption ?? current.caption}
          </figcaption>
        ) : null}
      </figure>

      {lightboxOpen ? (
        <ImageLightbox
          src={current.src}
          alt={current.alt}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}

export type ComparisonProps = {
  before: string;
  after: string;
  alt?: string;
  caption?: string;
  width?: MediaWidth;
  ratio?: string;
  fit?: MediaFit;
  beforeLabel?: string;
  afterLabel?: string;
};

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function Comparison({
  before,
  after,
  alt = "",
  caption,
  width = "default",
  ratio = DEFAULT_MEDIA_RATIO,
  fit = "cover",
  beforeLabel,
  afterLabel,
}: ComparisonProps) {
  const beforeSrc = resolveSrc(before);
  const afterSrc = resolveSrc(after);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const isLoaded = beforeLoaded && afterLoaded;
  const objectFitClass = fit === "contain" ? "object-contain" : "object-cover";

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    setPosition(clampPercent(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const onPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }, []);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((prev) => clampPercent(prev - step));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((prev) => clampPercent(prev + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }, []);

  if (!beforeSrc || !afterSrc) return null;

  const sliderLabel = alt
    ? `Compare before and after: ${alt}`
    : "Compare before and after images";

  return (
    <figure className={`work-media mb-8 ${widthClassName[width]}`}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-bg-card">
        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label={sliderLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className={[
            "relative w-full touch-none select-none overflow-hidden bg-bg-card outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
            dragging ? "cursor-grabbing" : "cursor-ew-resize",
          ].join(" ")}
          style={{ aspectRatio: ratio }}
        >
          <img
            src={afterSrc}
            alt={alt ? `${alt} (after)` : ""}
            draggable={false}
            loading="lazy"
            decoding="async"
            onLoad={() => setAfterLoaded(true)}
            className={[
              "absolute inset-0 h-full w-full transition-opacity duration-300",
              objectFitClass,
              isLoaded ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
          <img
            src={beforeSrc}
            alt={alt ? `${alt} (before)` : ""}
            draggable={false}
            loading="lazy"
            decoding="async"
            onLoad={() => setBeforeLoaded(true)}
            className={[
              "absolute inset-0 h-full w-full transition-opacity duration-300",
              objectFitClass,
              isLoaded ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          />

          <div
            className={`media-image-placeholder-fade absolute inset-0 transition-opacity duration-300 ${
              isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden
          >
            <div className="media-image-skeleton showcase-skeleton-breathe h-full w-full" />
          </div>

          {beforeLabel ? (
            <span
              className="pointer-events-none absolute top-3 left-3 rounded-md bg-bg-card/80 px-2 py-1 text-xs text-text-primary backdrop-blur-sm"
              aria-hidden
            >
              {beforeLabel}
            </span>
          ) : null}
          {afterLabel ? (
            <span
              className="pointer-events-none absolute top-3 right-3 rounded-md bg-bg-card/80 px-2 py-1 text-xs text-text-primary backdrop-blur-sm"
              aria-hidden
            >
              {afterLabel}
            </span>
          ) : null}

          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white"
            style={{ left: `${position}%` }}
            aria-hidden
          >
            <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ash-700 shadow-sm">
              <ComparisonIcon className="size-5" />
            </span>
          </div>
        </div>
      </div>
      <MediaCaption caption={caption} />
    </figure>
  );
}

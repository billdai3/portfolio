import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { Link } from "react-router-dom";
import {
  toDetailLocationState,
  type DetailFromHash,
  type DetailFromPath,
} from "@/features/projects/lib/detail-from";
import LockIcon from "./icons/LockIcon";
import LockOpenIcon from "./icons/LockOpenIcon";
import SquircleClip from "./SquircleClip";
import {
  ShowcaseCardImageSkeleton,
  ShowcaseCardTextSkeleton,
} from "./ShowcaseCardSkeleton";
import { useWorkUnlockHint } from "../features/work/lib/use-work-unlock-hint";

export type ShowcaseItem = {
  title: string;
  tag: string;
  href?: string;
  isLocked?: boolean;
  /** Where Go Back should return after opening this detail. */
  from?: DetailFromPath;
  /** Optional home-section hash when `from` is `/`. */
  hash?: DetailFromHash;
};

type ShowcaseCardProps = {
  item: ShowcaseItem;
  /** When true, shows rainbow stripe + text skeleton placeholders. */
  loading?: boolean;
  /** Preview image; shown in SquircleClip when not loading. */
  image?: string;
  /** Optional cover preview; muted loop on hover (desktop). */
  video?: string;
  /** Fired once when the cover image loads, errors, or is already complete. */
  onImageSettled?: () => void;
};

const HOVER_SPOTLIGHT_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function readHoverSpotlight(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  return window.matchMedia(HOVER_SPOTLIGHT_QUERY).matches;
}

/** True when grayscale idle + hover video are appropriate. */
function useHoverSpotlight(): boolean {
  const [enabled, setEnabled] = useState(readHoverSpotlight);

  useEffect(() => {
    const hover = window.matchMedia(HOVER_SPOTLIGHT_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setEnabled(readHoverSpotlight());

    hover.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      hover.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}

/** Hover visual variants for group children. */
const spotlight = {
  title: "group-hover:text-accent group-[.showcase-card--active]:text-accent",
  titleIdle:
    "group-hover:hidden group-[.showcase-card--active]:hidden",
  titleMarquee:
    "group-hover:inline-flex group-[.showcase-card--active]:inline-flex",
  image:
    "group-hover:grayscale-0 group-[.showcase-card--active]:grayscale-0",
  lock: "group-hover:bg-brand group-hover:text-ash-900 group-[.showcase-card--active]:bg-brand group-[.showcase-card--active]:text-ash-900",
  corner: "group-hover:rotate-45 group-[.showcase-card--active]:rotate-45",
} as const;

function ShowcaseCardLockTag({ unlocked }: { unlocked: boolean }) {
  const Icon = unlocked ? LockOpenIcon : LockIcon;

  return (
    <div
      className="pointer-events-none absolute top-[10%] left-[10%]"
      aria-label={unlocked ? "Unlocked project" : "Locked project"}
    >
      <span
        className={[
          "inline-flex size-12 items-center justify-center rounded-full bg-ash-700 text-text-secondary backdrop-blur-sm transition-[background-color,color] duration-300 ease-out",
          spotlight.lock,
        ].join(" ")}
      >
        <Icon className="size-6" />
      </span>
    </div>
  );
}

function ShowcaseCardTitleBar({ title }: { title: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLSpanElement>(null);
  const [marqueeStartPx, setMarqueeStartPx] = useState(0);
  const marqueeDurationSec = Math.max(6, title.length * 0.28);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const segment = segmentRef.current;

    if (!viewport || !segment) {
      return;
    }

    const syncMarqueeStart = () => {
      const viewportWidth = viewport.clientWidth;
      const segmentWidth = segment.offsetWidth;
      const idleMaxWidth = viewportWidth * 0.6;
      const idleBoxLeft = (viewportWidth - idleMaxWidth) / 2;

      // Match idle layout: short titles are centered; long titles start at the
      // left edge of the max-w-[60%] box so hover doesn't jump left.
      setMarqueeStartPx(
        segmentWidth <= idleMaxWidth
          ? (viewportWidth - segmentWidth) / 2
          : idleBoxLeft,
      );
    };

    syncMarqueeStart();

    const resizeObserver = new ResizeObserver(syncMarqueeStart);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, [title]);

  const marqueeStyle = {
    animationDuration: `${marqueeDurationSec}s`,
    "--marquee-start": `${marqueeStartPx}px`,
  } as CSSProperties;

  return (
    <div className="absolute inset-x-0 bottom-0 bg-bg-page/50 px-5 py-3 backdrop-blur-[2px]">
      <div ref={viewportRef} className="overflow-hidden">
        <span
          ref={segmentRef}
          className="invisible absolute pr-10 text-lg font-extrabold tracking-tight whitespace-nowrap"
          aria-hidden
        >
          {title}
        </span>
        <h3
          className={[
            "text-lg leading-tight font-extrabold tracking-tight text-ash-50 transition-colors duration-300 ease-out",
            spotlight.title,
          ].join(" ")}
        >
          <span
            className={[
              "showcase-title-idle mx-auto block max-w-[75%] truncate text-center",
              spotlight.titleIdle,
            ].join(" ")}
          >
            {title}
          </span>
          <span
            className={[
              "showcase-title-marquee hidden w-max",
              spotlight.titleMarquee,
            ].join(" ")}
            style={marqueeStyle}
          >
            <span className="pr-10 whitespace-nowrap">{title}</span>
            <span className="pr-10 whitespace-nowrap" aria-hidden>
              {title}
            </span>
            <span className="pr-10 whitespace-nowrap" aria-hidden>
              {title}
            </span>
          </span>
        </h3>
      </div>
    </div>
  );
}

const FOOTER_BAR_HEIGHTS = [45, 70, 90, 100, 90, 70, 45] as const;

function ShowcaseCardFooterBars() {
  return (
    <div
      className="flex h-full min-w-0 flex-1 items-center justify-center gap-2"
      aria-hidden
    >
      {FOOTER_BAR_HEIGHTS.map((height, index) => (
        <div
          key={index}
          className="w-2 rounded-full bg-ash-700"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function ShowcaseCardCornerDecoration() {
  return (
    <div
      className="relative size-7 shrink-0 rounded-full bg-ash-700"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={[
            "size-4 -rotate-45 rounded-full bg-ash-800 transition-transform duration-300 ease-out [clip-path:inset(0_0_50%_0)]",
            spotlight.corner,
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export default function ShowcaseCard({
  item,
  loading = false,
  image,
  video,
  onImageSettled,
}: ShowcaseCardProps) {
  const unlocked = useWorkUnlockHint();
  const hoverSpotlight = useHoverSpotlight();
  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageSettledRef = useRef(false);
  const [videoActive, setVideoActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [prevHoverSpotlight, setPrevHoverSpotlight] = useState(hoverSpotlight);
  const showVideo = Boolean(video) && hoverSpotlight;
  const spotlightActive = hoverSpotlight && isActive;
  const spotlightVideoActive = hoverSpotlight && videoActive;

  const notifyImageSettled = useCallback(() => {
    if (imageSettledRef.current) return;
    imageSettledRef.current = true;
    onImageSettled?.();
  }, [onImageSettled]);

  // Reset settle latch when the cover URL changes.
  useEffect(() => {
    imageSettledRef.current = false;
  }, [image]);

  // Cached / already-complete images may not fire onLoad.
  useEffect(() => {
    const el = imageRef.current;
    if (!el || !image) return;
    if (el.complete && el.naturalWidth > 0) {
      notifyImageSettled();
    }
  }, [image, notifyImageSettled]);

  // Reset interaction state when hover spotlight capability turns off
  // (React "adjust state when a value changes" pattern — avoid setState in effect).
  if (hoverSpotlight !== prevHoverSpotlight) {
    setPrevHoverSpotlight(hoverSpotlight);
    if (!hoverSpotlight) {
      setIsActive(false);
      setVideoActive(false);
      setShouldPreload(false);
    }
  }

  const deactivateSpotlight = useCallback(() => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setVideoActive(false);
    setIsActive(false);
  }, []);

  const activateSpotlight = useCallback(() => {
    setIsActive(true);

    const el = videoRef.current;
    if (!el) return;

    const playPromise = el.play();
    if (playPromise) {
      void playPromise
        .then(() => setVideoActive(true))
        .catch(() => setVideoActive(false));
      return;
    }
    setVideoActive(true);
  }, []);

  useEffect(() => {
    if (!showVideo) return;

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldPreload(true);
        observer.disconnect();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showVideo]);

  useEffect(() => {
    if (!shouldPreload || !showVideo) return;
    videoRef.current?.load();
  }, [shouldPreload, showVideo, video]);

  const handlePointerEnter = () => {
    if (!hoverSpotlight) return;
    activateSpotlight();
  };

  const handlePointerLeave = () => {
    if (!hoverSpotlight) return;
    deactivateSpotlight();
  };

  const cardClassName = [
    "group rounded-[8%] bg-bg-card p-5",
    item.href ? "block transition-colors" : "",
    spotlightActive ? "showcase-card--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageClassName = hoverSpotlight
    ? [
        "h-full w-full object-cover grayscale transition-[filter] duration-300 ease-out",
        spotlight.image,
      ].join(" ")
    : "h-full w-full object-cover";

  const inner = (
    <>
      <SquircleClip className="mb-3 overflow-hidden bg-ash-700">
        <div className="relative h-full w-full">
          {image ? (
            <img
              ref={imageRef}
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              className={imageClassName}
              onLoad={notifyImageSettled}
              onError={notifyImageSettled}
            />
          ) : null}
          {showVideo ? (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              preload={shouldPreload ? "metadata" : "none"}
              aria-hidden
              className={[
                "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
                spotlightVideoActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ) : null}
          {!loading ? <ShowcaseCardTitleBar title={item.title} /> : null}
          {!loading && item.isLocked ? (
            <ShowcaseCardLockTag unlocked={unlocked} />
          ) : null}
          <div
            className={`showcase-image-skeleton-fade absolute inset-0 transition-opacity duration-300 ease-out ${
              loading ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!loading}
          >
            <ShowcaseCardImageSkeleton />
          </div>
        </div>
      </SquircleClip>
      <div className="flex h-7 items-center gap-1.5">
        <ShowcaseCardCornerDecoration />
        {loading ? <ShowcaseCardTextSkeleton /> : <ShowcaseCardFooterBars />}
        <ShowcaseCardCornerDecoration />
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link
        ref={cardRef as Ref<HTMLAnchorElement>}
        to={item.href}
        state={toDetailLocationState({ from: item.from, hash: item.hash })}
        className={cardClassName}
        aria-busy={loading || undefined}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      ref={cardRef as Ref<HTMLDivElement>}
      className={cardClassName}
      aria-busy={loading || undefined}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      {inner}
    </div>
  );
}

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { Lock, LockOpen } from "lucide-react";
import { Link } from "react-router-dom";
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
};

type ShowcaseCardProps = {
  item: ShowcaseItem;
  /** When true, shows rainbow stripe + text skeleton placeholders. */
  loading?: boolean;
  /** Preview image; shown in SquircleClip when not loading. */
  image?: string;
  /** Optional hover preview; muted loop plays on fine-pointer hover. */
  video?: string;
};

function canHoverPlayVideo(hasVideo: boolean): boolean {
  if (!hasVideo || typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function ShowcaseCardLockTag({ unlocked }: { unlocked: boolean }) {
  const Icon = unlocked ? LockOpen : Lock;

  return (
    <div
      className="pointer-events-none absolute top-[10%] left-[10%]"
      aria-label={unlocked ? "Unlocked project" : "Locked project"}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-ash-700 text-text-secondary backdrop-blur-sm transition-[background-color,color] duration-300 ease-out group-hover:bg-brand group-hover:text-ash-900">
        <Icon className="size-5" strokeWidth={4} aria-hidden />
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
          className="invisible absolute whitespace-nowrap pr-10 text-lg font-extrabold tracking-tight"
          aria-hidden
        >
          {title}
        </span>
        <h3 className="text-lg font-extrabold leading-tight tracking-tight text-ash-50 transition-colors duration-300 ease-out group-hover:text-accent">
          <span className="showcase-title-idle mx-auto block max-w-[60%] truncate text-center group-hover:hidden">
            {title}
          </span>
          <span
            className="showcase-title-marquee hidden w-max group-hover:inline-flex"
            style={marqueeStyle}
          >
            <span className="whitespace-nowrap pr-10">{title}</span>
            <span className="whitespace-nowrap pr-10" aria-hidden>
              {title}
            </span>
            <span className="whitespace-nowrap pr-10" aria-hidden>
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
        <div className="size-4 -rotate-45 rounded-full bg-ash-800 transition-transform duration-300 ease-out group-hover:rotate-45 [clip-path:inset(0_0_50%_0)]" />
      </div>
    </div>
  );
}

export default function ShowcaseCard({
  item,
  loading = false,
  image,
  video,
}: ShowcaseCardProps) {
  const unlocked = useWorkUnlockHint();
  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoActive, setVideoActive] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);

  useEffect(() => {
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, [video]);

  useEffect(() => {
    if (!shouldPreload) return;
    videoRef.current?.load();
  }, [shouldPreload, video]);

  const handlePointerEnter = () => {
    if (!canHoverPlayVideo(Boolean(video))) return;
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
  };

  const handlePointerLeave = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setVideoActive(false);
  };

  const inner = (
    <>
      <SquircleClip className="mb-3 overflow-hidden bg-ash-700">
        <div className="relative h-full w-full">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
            />
          ) : null}
          {video ? (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              preload={shouldPreload ? "auto" : "none"}
              aria-hidden
              className={[
                "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
                videoActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ) : null}
          {!loading ? <ShowcaseCardTitleBar title={item.title} /> : null}
          {!loading && item.isLocked ? (
            <ShowcaseCardLockTag unlocked={unlocked} />
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
        className="group block rounded-[8%] bg-bg-card p-5 transition-colors"
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
      className="group rounded-[8%] bg-bg-card p-5"
      aria-busy={loading || undefined}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      {inner}
    </div>
  );
}

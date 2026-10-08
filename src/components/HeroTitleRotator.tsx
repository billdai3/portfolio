import { useEffect, useState } from "react";

const HERO_TITLES = [
  "Bill's Portfolio",
  "UI/UX Design",
  "Graphic Design",
  "Creative Coding",
] as const;

/** Time each title stays fully visible. */
const HOLD_MS = 3000;
/** Slide duration — keep in sync with `duration-500`. */
const TRANSITION_MS = 500;

/** Clip / slide slot height (em of `.type-hero-title`). */
const LINE_EM = 1.25;

export default function HeroTitleRotator() {
  const slides = [...HERO_TITLES, HERO_TITLES[0]];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, HOLD_MS + TRANSITION_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || index < HERO_TITLES.length) return;

    const id = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, TRANSITION_MS);

    return () => window.clearTimeout(id);
  }, [index, reduceMotion]);

  const liveIndex = index % HERO_TITLES.length;

  if (reduceMotion) {
    return <h1 className="type-hero-title text-ash-900">{HERO_TITLES[0]}</h1>;
  }

  return (
    <h1 className="type-hero-title text-ash-900">
      <span className="sr-only" aria-live="polite">
        {HERO_TITLES[liveIndex]}
      </span>
      <span
        className="relative mx-auto block overflow-hidden"
        style={{ height: `${LINE_EM}em` }}
        aria-hidden
      >
        <span
          className={[
            "block",
            animate ? "transition-transform duration-500 ease-out" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateY(-${index * LINE_EM}em)` }}
        >
          {slides.map((title, i) => (
            <span
              key={`${title}-${i}`}
              className="flex items-center justify-center whitespace-nowrap leading-none"
              style={{ height: `${LINE_EM}em` }}
            >
              {title}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}

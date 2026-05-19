import gsap from "gsap";
import { useEffect, useRef } from "react";

type HeroAnimationProps = {
  className?: string;
};

export default function HeroAnimation({ className }: HeroAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const shapes = svg.querySelectorAll<SVGElement>("[data-hero-animate]");

    const ctx = gsap.context(() => {
      gsap.to(shapes, {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        stagger: 0.12,
        repeat: -1,
        yoyo: true,
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hero illustration"
    >
      <circle
        data-hero-animate
        cx="160"
        cy="160"
        r="72"
        className="fill-ash-900"
      />
      <rect
        data-hero-animate
        x="56"
        y="88"
        width="48"
        height="48"
        rx="12"
        className="fill-ash-900/80"
      />
      <rect
        data-hero-animate
        x="216"
        y="184"
        width="56"
        height="56"
        rx="14"
        className="fill-ash-900/60"
      />
    </svg>
  );
}

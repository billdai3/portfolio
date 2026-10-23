import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import ArrowIcon from "../components/icons/ArrowIcon";
import CtaLink from "../components/CtaLink";
import HeroAnimation from "../components/HeroAnimation";
import HeroTitleRotator from "../components/HeroTitleRotator";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { labProjects } from "../features/lab/lib/registry";
import { workProjects } from "../features/work/lib/registry";
import {
  SITE_TITLE,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

const HOME_SECTION_HASHES = new Set(["home-work", "home-lab"]);

const experiments = labProjects.slice(0, 2).map((item) => ({
  title: item.title,
  tag: item.tag,
  href: `/lab/${item.slug}`,
  from: "/" as const,
  hash: "home-lab" as const,
  cover: item.cover,
  coverVideo: item.coverVideo,
}));

export default function HomePage() {
  const location = useLocation();
  useDocumentTitle(SITE_TITLE);

  const selectedWorks = workProjects.slice(0, 2).map((item) => ({
    title: item.title,
    tag: item.tag,
    href: `/work/${item.slug}`,
    from: "/" as const,
    hash: "home-work" as const,
    cover: item.cover,
    coverVideo: item.coverVideo,
    isLocked: item.isLocked,
  }));

  // Own hash scrolling here so it runs after this page is actually mounted
  // (Layout retries alone can miss when coming back from some detail routes).
  useLayoutEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!HOME_SECTION_HASHES.has(id)) return;

    const scrollToSection = () => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    scrollToSection();
    const frame = requestAnimationFrame(scrollToSection);
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  const scrollToHomeWork = () => {
    document
      .getElementById("home-work")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-w-0 text-text-primary">
      {/* Hero — 100vh */}
      <section
        id="home-hero"
        className="relative grid h-svh w-full min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-brand"
        aria-label="Hero"
      >
        <div className="flex min-h-0 min-w-0 items-center justify-center px-6 pt-24">
          <HeroAnimation className="aspect-square h-auto max-h-full w-full max-w-xl min-w-0" />
        </div>

        <div className="flex min-w-0 flex-col items-center pt-2 pb-6 text-center sm:pb-10">
          <HeroTitleRotator />
          <div className="mt-0 lg:absolute lg:-right-6 lg:bottom-20 lg:z-10">
            <button
              type="button"
              onClick={scrollToHomeWork}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-transparent px-4 py-2 text-ash-900 transition hover:text-ash-50 focus-visible:border-ash-900 focus-visible:ring-2 focus-visible:ring-ash-50 focus-visible:outline-none lg:rotate-90"
              aria-label="Scroll to Selected Works"
            >
              <span className="type-scroll">Scroll</span>
              <ArrowIcon
                direction="down"
                className="size-5 shrink-0 sm:size-6 md:size-8 lg:hidden"
              />
              <ArrowIcon
                direction="right"
                className="hidden size-8 shrink-0 lg:inline"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Selected Works — ash-900 block, ash-800 cards */}
      <section
        id="home-work"
        className="section-shell bg-bg-section"
        aria-labelledby="home-selected-works-heading"
      >
        <div className="section-inner">
          <h2
            id="home-selected-works-heading"
            className="type-section-title section-heading"
          >
            Selected Works
          </h2>
          <ul className="showcase-grid">
            {selectedWorks.map((item) => (
              <li key={item.href}>
                <ShowcaseCardDelayed
                  item={{
                    title: item.title,
                    tag: item.tag,
                    href: item.href,
                    from: item.from,
                    hash: item.hash,
                    isLocked: item.isLocked,
                  }}
                  image={item.cover}
                  video={item.coverVideo}
                />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center sm:mt-12">
            <CtaLink to="/work">View all work</CtaLink>
          </p>
        </div>
      </section>

      {/* Creative Coding & Experiments — ash-700 block, ash-800 cards */}
      <section
        id="home-lab"
        className="section-shell bg-bg-section-alt"
        aria-labelledby="home-experiments-heading"
      >
        <div className="section-inner">
          <h2
            id="home-experiments-heading"
            className="type-section-title section-heading"
          >
            Creative Coding &amp; Experiments
          </h2>
          <ul className="showcase-grid">
            {experiments.map((item) => (
              <li key={item.title}>
                <ShowcaseCardDelayed
                  item={{
                    title: item.title,
                    tag: item.tag,
                    href: item.href,
                    from: item.from,
                    hash: item.hash,
                  }}
                  image={item.cover}
                  video={item.coverVideo}
                />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center sm:mt-12">
            <CtaLink to="/lab">Open lab</CtaLink>
          </p>
        </div>
      </section>
    </div>
  );
}

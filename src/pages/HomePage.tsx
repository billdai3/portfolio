import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroAnimation from "../components/HeroAnimation";
import HeroTitleRotator from "../components/HeroTitleRotator";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { labProjects } from "../features/lab/lib/registry";
import { workProjects } from "../features/work/lib/registry";

const experiments = labProjects.slice(0, 2).map((item) => ({
  title: item.title,
  tag: item.tag,
  href: `/lab/${item.slug}`,
  cover: item.cover,
  coverVideo: item.coverVideo,
}));

export default function HomePage() {
  const selectedWorks = workProjects.slice(0, 2).map((item) => ({
    title: item.title,
    tag: item.tag,
    href: `/work/${item.slug}`,
    cover: item.cover,
    coverVideo: item.coverVideo,
    isLocked: item.isLocked,
  }));

  const scrollToSelectedWorks = () => {
    document
      .getElementById("selected-works")
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
        <div className="flex min-h-0 min-w-0 items-center justify-center px-6 pt-20">
          <HeroAnimation className="aspect-square h-auto max-h-full min-w-0 w-full max-w-xl" />
        </div>

        <div className="min-w-0 pb-16 pt-2 text-center sm:pb-24">
          <HeroTitleRotator />
        </div>

        <button
          type="button"
          onClick={scrollToSelectedWorks}
          className="type-page-title absolute bottom-30 right-6 z-10 inline-flex rotate-90 cursor-pointer items-center gap-1 rounded-full border border-transparent px-4 py-2 text-ash-900 transition hover:text-ash-50 focus-visible:border-ash-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ash-50"
          aria-label="Scroll to Selected Works"
        >
          Scroll
          <ArrowRight className="size-8 shrink-0" strokeWidth={3} aria-hidden />
        </button>
      </section>

      {/* Selected Works — ash-900 block, ash-800 cards */}
      <section
        id="selected-works"
        className="bg-bg-section px-6 py-20 sm:py-24"
        aria-labelledby="home-selected-works-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="home-selected-works-heading"
            className="type-section-title mb-10 text-center sm:mb-12"
          >
            Selected Works
          </h2>
          <ul className="grid gap-10 sm:grid-cols-2">
            {selectedWorks.map((item) => (
              <li key={item.href}>
                <ShowcaseCardDelayed
                  item={{
                    title: item.title,
                    tag: item.tag,
                    href: item.href,
                    isLocked: item.isLocked,
                  }}
                  image={item.cover}
                  video={item.coverVideo}
                />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center sm:mt-12">
            <Link
              to="/work"
              className="type-btn inline-flex rounded-full bg-bg-card px-6 py-3 text-text-primary transition-colors duration-300 ease-out hover:bg-brand hover:text-ash-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              View all work
            </Link>
          </p>
        </div>
      </section>

      {/* Creative Coding & Experiments — ash-700 block, ash-800 cards */}
      <section
        className="bg-bg-section-alt px-6 py-20 sm:py-24"
        aria-labelledby="home-experiments-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="home-experiments-heading"
            className="type-section-title mb-10 text-center sm:mb-12"
          >
            Creative Coding &amp; Experiments
          </h2>
          <ul className="grid gap-10 sm:grid-cols-2">
            {experiments.map((item) => (
              <li key={item.title}>
                <ShowcaseCardDelayed
                  item={{
                    title: item.title,
                    tag: item.tag,
                    href: item.href,
                  }}
                  image={item.cover}
                  video={item.coverVideo}
                />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center sm:mt-12">
            <Link
              to="/lab"
              className="type-btn inline-flex rounded-full bg-bg-card px-6 py-3 text-text-primary transition-colors duration-300 ease-out hover:bg-brand hover:text-ash-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Open lab
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

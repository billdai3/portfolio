import { Link } from "react-router-dom";
import HeroAnimation from "../components/HeroAnimation";
import ShowcaseCardDelayed from "../components/ShowcaseCardDelayed";
import { labProjects } from "../features/lab/lib/registry";
import { workProjects } from "../features/work/lib/registry";

const experiments = labProjects.slice(0, 2).map((item) => ({
  title: item.title,
  tag: item.tag,
  href: `/lab/${item.slug}`,
}));

export default function HomePage() {
  const selectedWorks = workProjects.slice(0, 2).map((item) => ({
    title: item.title,
    tag: item.tag,
    href: `/work/${item.slug}`,
    cover: item.cover,
    isLocked: item.isLocked,
  }));

  const scrollToSelectedWorks = () => {
    document
      .getElementById("selected-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="text-text-primary">
      {/* Hero — 100vh */}
      <section
        id="home-hero"
        className="relative grid min-h-screen grid-rows-[1fr_minmax(0,45vh)_auto] bg-brand"
        aria-label="Hero"
      >
        <div className="min-h-0" aria-hidden />

        <div className="flex min-h-0 items-center justify-center px-6">
          <HeroAnimation className="aspect-square h-full max-h-[min(45vh,24rem)] w-full max-w-md" />
        </div>

        <div className="flex flex-col items-center px-6 pb-16 pt-6 text-center text-ash-900 sm:pb-24">
          <h1 className="type-hero-title">Bill's Portfolio</h1>
          <p className="type-hero-subtitle mt-3">UI/UX Design</p>
        </div>

        <button
          type="button"
          onClick={scrollToSelectedWorks}
          className="type-btn absolute bottom-10 right-6 z-10 cursor-pointer rounded-full border border-transparent px-2 py-6 text-ash-700 transition hover:text-ash-900 focus-visible:border-ash-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ash-400"
          aria-label="Scroll to Selected Works"
        >
          <span className="inline-block rotate-90">Scroll</span>
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
                <ShowcaseCardDelayed item={item} />
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

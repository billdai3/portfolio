import { Link } from 'react-router-dom'

type ShowcaseItem = {
  title: string
  tag: string
  href?: string
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const inner = (
    <>
      <div className="mb-5 aspect-16/10 rounded-xl bg-ash-100" />
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {item.tag}
      </p>
      <h3 className="mt-1.5 text-lg font-medium tracking-tight text-text-primary">
        {item.title}
      </h3>
    </>
  )

  if (item.href) {
    return (
      <Link
        to={item.href}
        className="block rounded-2xl border border-border-default bg-bg-elevated p-5 transition hover:border-border-strong hover:shadow-sm"
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className="rounded-2xl border border-border-default bg-bg-elevated p-5">
      {inner}
    </div>
  )
}

const selectedWorks: ShowcaseItem[] = [
  { title: 'Project Alpha', tag: 'Product design', href: '/work' },
  { title: 'Project Beta', tag: 'Brand & web', href: '/work' },
]

const experiments: ShowcaseItem[] = [
  { title: 'Sketch One', tag: 'WebGL', href: '/lab' },
  { title: 'Sketch Two', tag: 'Generative', href: '/lab' },
]

export default function HomePage() {
  const scrollToSelectedWorks = () => {
    document
      .getElementById('selected-works')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="text-text-primary">
      {/* Hero — 100vh */}
      <section
        className="relative flex min-h-screen flex-col justify-center px-6 py-16"
        aria-label="Hero"
      >
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Bill's Portfolio
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
            <span className="text-text-muted">: </span>
            <a
              href="mailto:twbilldai@gmail.com"
              className="text-text-primary underline decoration-ash-200 underline-offset-4 transition hover:decoration-ash-900"
            >
              twbilldai@gmail.com
            </a>
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToSelectedWorks}
          className="absolute bottom-10 right-6 z-10 cursor-pointer rounded-full border border-transparent px-2 py-6 text-sm font-medium text-text-muted transition hover:text-text-primary focus-visible:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ash-300"
          aria-label="Scroll to Selected Works"
        >
          <span className="inline-block rotate-90">Scroll</span>
        </button>
      </section>

      {/* Selected Works */}
      <section
        id="selected-works"
        className="border-t border-border-default bg-bg-soft px-6 py-20 sm:py-24"
        aria-labelledby="home-selected-works-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="home-selected-works-heading"
                className="text-2xl font-medium tracking-tight sm:text-3xl"
              >
                Selected Works
              </h2>
              <p className="mt-2 max-w-lg text-text-secondary">
                Two featured projects. Swap titles, tags, and thumbnails later.
              </p>
            </div>
            <Link
              to="/work"
              className="text-sm font-medium text-text-primary underline-offset-4 hover:underline"
            >
              View all work
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {selectedWorks.map((item) => (
              <li key={item.title}>
                <ShowcaseCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Creative Coding & Experiments */}
      <section
        className="border-t border-border-default px-6 py-20 sm:py-24"
        aria-labelledby="home-experiments-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="home-experiments-heading"
                className="text-2xl font-medium tracking-tight sm:text-3xl"
              >
                Creative Coding &amp; Experiments
              </h2>
              <p className="mt-2 max-w-lg text-text-secondary">
                Two lab pieces. Link through to Lab when you have real pages.
              </p>
            </div>
            <Link
              to="/lab"
              className="text-sm font-medium text-text-primary underline-offset-4 hover:underline"
            >
              Open lab
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {experiments.map((item) => (
              <li key={item.title}>
                <ShowcaseCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

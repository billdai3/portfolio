type PageShellProps = {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function PageShell({
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="type-page-title text-text-primary">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

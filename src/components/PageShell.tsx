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
        <h1 className="text-3xl font-medium tracking-tight text-text-primary md:text-4xl">
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

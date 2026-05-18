import PageShell from '../components/PageShell'

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      description="A short bio, background, and what you're looking for. Swap in your story when you're ready."
    >
      <div className="max-w-2xl space-y-6 text-base leading-relaxed text-text-secondary">
        <p>
          Write a paragraph about who you are, what you care about, and the
          kind of work you do. Keep it conversational — this page is for people
          who want to know the person behind the portfolio.
        </p>
        <p>
          You can add contact links, résumé download, or social profiles in a
          follow-up pass.
        </p>
      </div>
    </PageShell>
  )
}

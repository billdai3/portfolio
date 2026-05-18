import PageShell from '../components/PageShell'

const placeholderProjects = [
  { title: 'Project One', tag: 'Case study' },
  { title: 'Project Two', tag: 'Web app' },
  { title: 'Project Three', tag: 'Branding' },
]

export default function WorkPage() {
  return (
    <PageShell
      title="Work"
      description="Selected projects and case studies. Replace these placeholders with your real work."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {placeholderProjects.map((project) => (
          <li
            key={project.title}
            className="rounded-lg border border-border-default bg-bg-elevated p-6"
          >
            <div className="mb-8 aspect-4/3 rounded-md bg-ash-100" />
            <p className="text-xs uppercase tracking-wide text-text-muted">
              {project.tag}
            </p>
            <h2 className="mt-2 text-lg font-medium text-text-primary">
              {project.title}
            </h2>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}

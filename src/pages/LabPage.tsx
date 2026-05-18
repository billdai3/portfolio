import PageShell from '../components/PageShell'

const placeholderExperiments = [
  { title: 'Experiment A', note: 'Prototype / sketch' },
  { title: 'Experiment B', note: 'Side project' },
]

export default function LabPage() {
  return (
    <PageShell
      title="Lab"
      description="Experiments, prototypes, and work-in-progress ideas live here."
    >
      <ul className="divide-y divide-border-default border-y border-border-default">
        {placeholderExperiments.map((item) => (
          <li
            key={item.title}
            className="flex items-baseline justify-between gap-4 py-5"
          >
            <span className="font-medium text-text-primary">{item.title}</span>
            <span className="text-sm text-text-muted">{item.note}</span>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}

import type { ReactNode } from "react";

export type ProjectInfoItem = {
  label: ReactNode;
  value: ReactNode;
};

type ProjectInfoProps = {
  items: ProjectInfoItem[];
};

export function ProjectInfo({ items }: ProjectInfoProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-4 mb-6 rounded-3xl bg-bg-card/60 p-4 sm:p-8"
      aria-label="Project information"
    >
      <dl className="space-y-4 sm:space-y-5">
        {items.map(({ label, value }, index) => (
          <div
            key={typeof label === "string" ? label : index}
            className="grid gap-1 sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] sm:gap-x-4"
          >
            <dt className="text-sm text-text-secondary">{label}</dt>
            <dd className="m-0 text-sm text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

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
      className="mb-8 rounded-2xl border border-border-default bg-bg-card/60 p-5 sm:p-6"
      aria-label="Project information"
    >
      <dl className="space-y-4 sm:space-y-5">
        {items.map(({ label, value }, index) => (
          <div
            key={typeof label === "string" ? label : index}
            className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-x-6"
          >
            <dt className="type-btn text-xs text-text-muted">{label}</dt>
            <dd className="m-0 text-sm leading-relaxed text-text-primary">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

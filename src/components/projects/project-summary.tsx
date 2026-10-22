import Link from "next/link";
import type { Project } from "@/types/content";
import { CoverPlate } from "@/components/projects/cover-plate";

type ProjectSummaryProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectSummary({ project, featured = false }: ProjectSummaryProps) {
  return (
    <article className={featured ? "grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start" : "grid gap-5"}>
      <Link href={`/projects/${project.slug}`} className="block">
        <CoverPlate
          label={project.coverLabel}
          title={project.title}
          className={featured ? "min-h-72" : "min-h-48"}
        />
      </Link>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{project.role}</p>
        <h3 className="mt-3 font-serif text-3xl leading-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 text-ink/80">{project.summary}</p>
        <dl className="mt-6 grid gap-4 text-sm">
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted">Problem</dt>
            <dd className="mt-1 text-ink">{project.problem}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted">Solution</dt>
            <dd className="mt-1 text-ink">{project.solution}</dd>
          </div>
        </dl>
        {project.outcomes[0] ? (
          <p className="mt-5 border-l-2 border-accent pl-4 text-sm text-ink/80">
            {project.outcomes[0]}
          </p>
        ) : null}
        <p className="mt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm uppercase tracking-[0.12em] text-accent"
          >
            Read the case study
          </Link>
        </p>
      </div>
    </article>
  );
}

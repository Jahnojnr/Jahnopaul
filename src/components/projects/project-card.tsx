import Link from "next/link";
import type { Project } from "@/types/content";
import { CoverPlate } from "@/components/projects/cover-plate";

type ProjectCardProps = {
  project: Project;
  index?: string;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="grid gap-6 border-t border-line py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
      <Link href={`/projects/${project.slug}`} className="block">
        <CoverPlate label={project.coverLabel} title={project.title} />
      </Link>
      <div className="flex flex-col justify-center">
        {index ? (
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{index}</p>
        ) : null}
        <h2 className="mt-3 font-serif text-3xl leading-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm uppercase tracking-[0.12em] text-muted">
          {project.role}
        </p>
        <p className="mt-4 max-w-xl text-ink/80">{project.summary}</p>
        <dl className="mt-6 grid gap-4 text-sm md:grid-cols-3">
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted">Problem</dt>
            <dd className="mt-2 text-ink/80">{project.problem}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted">Solution</dt>
            <dd className="mt-2 text-ink/80">{project.solution}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.14em] text-muted">Outcome</dt>
            <dd className="mt-2 text-ink/80">{project.outcomes[0]}</dd>
          </div>
        </dl>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex text-sm uppercase tracking-[0.14em] text-accent hover:text-accent-hover"
        >
          Read the case study
        </Link>
      </div>
    </article>
  );
}

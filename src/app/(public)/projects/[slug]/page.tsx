import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverPlate } from "@/components/projects/cover-plate";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article>
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Case study · {formatDate(project.publishedAt)}
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-xl text-ink/80">{project.summary}</p>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-muted">
          {project.role}
        </p>
        <div className="mt-10">
          <CoverPlate label={project.coverLabel} title={project.title} />
        </div>
        <dl className="mt-12 grid gap-8 border-y border-line py-10 md:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Problem</dt>
            <dd className="mt-3 text-ink/80">{project.problem}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Solution</dt>
            <dd className="mt-3 text-ink/80">{project.solution}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Role</dt>
            <dd className="mt-3 text-ink/80">{project.role}</dd>
          </div>
        </dl>
        <div className="prose-editorial mt-12 max-w-2xl">
          {project.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section className="mt-12 max-w-2xl">
          <h2 className="font-serif text-3xl">Outcomes</h2>
          <ul className="mt-5 space-y-3">
            {project.outcomes.map((outcome) => (
              <li key={outcome} className="border-b border-line pb-3">
                {outcome}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-12 flex flex-wrap gap-6 text-sm uppercase tracking-[0.12em] text-muted">
          <p>{project.categories.map((item) => item.name).join(" · ")}</p>
          <p>{project.technologies.map((item) => item.name).join(" · ")}</p>
        </section>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/projects" variant="secondary">
            Back to projects
          </ButtonLink>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.08em] text-accent"
          >
            Discuss similar work
          </Link>
        </div>
      </Container>
    </article>
  );
}

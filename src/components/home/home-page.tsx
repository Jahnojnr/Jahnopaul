import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ProjectCard } from "@/components/projects/project-card";
import { siteConfig } from "@/config/site";
import { profile, skillGroups, experiences } from "@/lib/data/profile";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getPublishedPosts } from "@/lib/data/writing";
import { formatYearRange } from "@/lib/utils";

export function HomePage() {
  const featured = getFeaturedProjects();
  const posts = getPublishedPosts().slice(0, 3);
  const skills = skillGroups.flatMap((group) => group.skills.slice(0, 2));
  const currentWork = experiences[0];

  return (
    <>
      <section className="border-b border-line">
        <Container className="grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Personal portfolio · {siteConfig.headline}
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-charcoal md:text-7xl">
              {profile.name}.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-ink/80">
              {profile.headline}. {profile.bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">View projects</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact
              </ButtonLink>
            </div>
          </div>
          <aside className="self-end border border-line bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Selected work / 2024 — 2026
            </p>
            <p className="mt-4 font-serif text-2xl leading-snug">
              Building digital experiences with purpose.
            </p>
            <ul className="mt-6 space-y-2 text-sm uppercase tracking-[0.12em] text-muted">
              <li>Engineering</li>
              <li>Product design</li>
              <li>Innovation</li>
            </ul>
          </aside>
        </Container>
      </section>

      <section>
        <Container className="py-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">02 / Selected work</p>
              <h2 className="mt-3 font-serif text-4xl">Case studies with outcomes.</h2>
            </div>
            <ButtonLink href="/projects" variant="text">
              All projects
            </ButtonLink>
          </div>
          {featured.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={`0${index + 1}`}
            />
          ))}
        </Container>
      </section>

      <section className="border-y border-line bg-paper">
        <Container className="grid gap-10 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">03 / Professional profile</p>
            <h2 className="mt-3 font-serif text-4xl">Software, design, blockchain, and teaching.</h2>
          </div>
          <div className="prose-editorial max-w-xl">
            {profile.longerBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm uppercase tracking-[0.14em]"
            >
              About the practice
            </Link>
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-10 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">04 / Expertise</p>
            <h2 className="mt-3 font-serif text-4xl">A curated selection, not a tool dump.</h2>
            <ButtonLink href="/skills" variant="text" className="mt-6">
              View skills
            </ButtonLink>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <li key={skill} className="border-b border-line py-4 text-lg">
                {skill}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="grid gap-10 py-16 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">05 / Experience and impact</p>
            <h2 className="mt-3 font-serif text-4xl">A career timeline with concrete contributions.</h2>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-muted">
              {formatYearRange(currentWork.startDate, currentWork.endDate, currentWork.isCurrent)}
            </p>
            <h3 className="mt-3 font-serif text-3xl">{currentWork.role}</h3>
            <p className="mt-2 text-muted">{currentWork.organization}</p>
            <p className="mt-4 max-w-xl text-ink/80">{currentWork.description}</p>
            <ButtonLink href="/experience" variant="text" className="mt-6">
              Full experience
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper">
        <Container className="py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">06 / Writing and insights</p>
          <h2 className="mt-3 font-serif text-4xl">Recent articles and lessons learned.</h2>
          <div className="mt-8">
            {posts.map((post) => (
              <article key={post.id} className="border-t border-line py-6">
                <h3 className="font-serif text-2xl">
                  <Link href={`/writing/${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-2xl text-ink/80">{post.excerpt}</p>
              </article>
            ))}
          </div>
          <ButtonLink href="/writing" variant="text" className="mt-4">
            All writing
          </ButtonLink>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">07 / Contact</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
            If you are discussing work, collaboration, or a teaching engagement, start here.
          </h2>
          <div className="mt-8">
            <ButtonLink href="/contact">Open the contact page</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

import { PrintResumeButton } from "@/components/resume/print-resume-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { education, experiences, profile, skillGroups } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { formatYearRange } from "@/lib/utils";

export const metadata = createPageMetadata(
  "Résumé",
  "Résumé page and print-friendly download.",
  "/resume",
);

export default function ResumePage() {
  return (
    <Container className="py-16">
      <div className="flex flex-col gap-6 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
        <PageIntro
          eyebrow="Résumé"
          title={`${profile.name}, ${profile.headline}.`}
          description="A concise professional record. A hosted PDF will be added with media storage; until then this page can be printed or saved as a PDF from the browser."
        />
        <PrintResumeButton />
      </div>
      <section className="grid gap-10 py-10 md:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Experience</h2>
          <div className="mt-6 space-y-8">
            {experiences.map((item) => (
              <article key={item.id}>
                <p className="text-sm text-muted">
                  {formatYearRange(item.startDate, item.endDate, item.isCurrent)}
                </p>
                <h3 className="mt-1 font-serif text-2xl">{item.role}</h3>
                <p>{item.organization}</p>
                <p className="mt-2 text-ink/80">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-10">
          <section>
            <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Skills</h2>
            {skillGroups.map((group) => (
              <p key={group.id} className="mt-4">
                <span className="font-medium">{group.name}: </span>
                {group.skills.join(", ")}
              </p>
            ))}
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Education</h2>
            {education.map((item) => (
              <article key={item.id} className="mt-4">
                <h3 className="font-serif text-2xl">{item.credential}</h3>
                <p className="text-muted">
                  {item.institution} · {item.period}
                </p>
              </article>
            ))}
          </section>
        </div>
      </section>
      <ButtonLink href="/contact" className="print:hidden">
        Contact
      </ButtonLink>
    </Container>
  );
}

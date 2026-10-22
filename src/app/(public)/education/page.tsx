import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { education } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Education",
  "Education, training, and certifications.",
  "/education",
);

export default function EducationPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Education"
        title="Education, training, and certifications."
        description="Formal study, studio practice, and targeted training that support the current work."
      />
      <div className="mt-12">
        {education.map((item) => (
          <article key={item.id} className="border-t border-line py-10">
            <p className="text-sm uppercase tracking-[0.12em] text-muted">
              {item.period}
            </p>
            <h2 className="mt-3 font-serif text-3xl">{item.credential}</h2>
            <p className="mt-1 text-muted">{item.institution}</p>
            <p className="mt-4 max-w-2xl text-ink/80">{item.description}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}

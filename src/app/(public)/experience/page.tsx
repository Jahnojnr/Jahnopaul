import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { experiences } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { formatYearRange } from "@/lib/utils";

export const metadata = createPageMetadata(
  "Experience",
  "Career timeline and responsibilities.",
  "/experience",
);

export default function ExperiencePage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Experience"
        title="Career timeline and concrete contributions."
        description="A record of independent practice, product work, and teaching. Dates and descriptions will continue to be refined as the content model moves into the database."
      />
      <ol className="mt-12">
        {experiences.map((item) => (
          <li key={item.id} className="grid gap-4 border-t border-line py-10 md:grid-cols-[200px_1fr]">
            <p className="text-sm uppercase tracking-[0.12em] text-muted">
              {formatYearRange(item.startDate, item.endDate, item.isCurrent)}
            </p>
            <div>
              <h2 className="font-serif text-3xl">{item.role}</h2>
              <p className="mt-1 text-muted">{item.organization}</p>
              <p className="mt-4 max-w-2xl text-ink/80">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}

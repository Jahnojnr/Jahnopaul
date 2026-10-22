import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { achievements } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Achievements",
  "Awards, milestones, and notable contributions.",
  "/achievements",
);

export default function AchievementsPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Achievements"
        title="Milestones and notable contributions."
        description="Selected markers from the practice, written as facts rather than a prize list."
      />
      <div className="mt-12">
        {achievements.map((item) => (
          <article key={item.id} className="grid gap-4 border-t border-line py-10 md:grid-cols-[120px_1fr]">
            <p className="text-sm uppercase tracking-[0.12em] text-muted">{item.year}</p>
            <div>
              <h2 className="font-serif text-3xl">{item.title}</h2>
              <p className="mt-3 max-w-2xl text-ink/80">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}

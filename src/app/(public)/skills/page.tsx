import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { skillGroups } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Skills",
  "Technical, design, and professional skills.",
  "/skills",
);

export default function SkillsPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Skills"
        title="A curated selection of capabilities."
        description="These are the skills used in current work, not an exhaustive inventory of every tool ever touched."
      />
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        {skillGroups.map((group) => (
          <section key={group.id}>
            <h2 className="font-serif text-2xl">{group.name}</h2>
            <ul className="mt-5 space-y-3">
              {group.skills.map((skill) => (
                <li key={skill} className="border-b border-line pb-3">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

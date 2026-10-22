import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { uses } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Uses",
  "Tools and technologies in current use.",
  "/uses",
);

export default function UsesPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Uses"
        title="Tools and technologies in current use."
        description="A short inventory of the working environment, kept small on purpose."
      />
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        {uses.map((group) => (
          <section key={group.id}>
            <h2 className="font-serif text-2xl">{group.name}</h2>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="border-b border-line pb-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

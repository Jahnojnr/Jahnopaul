import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { profile } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "About",
  "Biography, professional positioning, and values.",
  "/about",
);

export default function AboutPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="About"
        title="A practice that builds, designs, and teaches."
        description={profile.bio}
      />
      <div className="mt-12 grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="prose-editorial max-w-2xl">
          {profile.longerBio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="space-y-8">
          {profile.values.map((value) => (
            <li key={value.title}>
              <h2 className="font-serif text-2xl">{value.title}</h2>
              <p className="mt-2 text-ink/80">{value.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

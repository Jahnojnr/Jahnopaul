import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { now } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Now",
  "Current professional focus.",
  "/now",
);

export default function NowPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow={`Now · updated ${now.updated}`}
        title="Current professional focus."
        description="What the practice is concentrating on in this season of work."
      />
      <ol className="mt-12 max-w-2xl space-y-6">
        {now.focus.map((item, index) => (
          <li key={item} className="border-t border-line pt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 text-lg">{item}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}

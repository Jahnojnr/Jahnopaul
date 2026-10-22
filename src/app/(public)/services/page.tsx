import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { services } from "@/lib/data/profile";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Services",
  "Services, capabilities, and engagement options.",
  "/services",
);

export default function ServicesPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Services"
        title="Capabilities and ways to work together."
        description="Engagements are scoped around a clear problem. The three offers below cover product design, software engineering, and technology education."
      />
      <div className="mt-12 grid gap-8">
        {services.map((service) => (
          <article key={service.id} className="grid gap-6 border-t border-line py-10 md:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-serif text-3xl">{service.title}</h2>
              <p className="mt-3 max-w-md text-ink/80">{service.summary}</p>
            </div>
            <ul className="space-y-3">
              {service.details.map((detail) => (
                <li key={detail} className="border-b border-line pb-3">
                  {detail}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mt-4">
        <ButtonLink href="/contact">Discuss an engagement</ButtonLink>
      </div>
    </Container>
  );
}

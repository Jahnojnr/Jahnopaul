import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Contact form and professional links.",
  "/contact",
);

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr]">
      <div>
        <PageIntro
          eyebrow="Contact"
          title="Discuss work, collaboration, or a teaching engagement."
          description="Share a short brief about the work, the collaboration, or the teaching engagement. Messages are validated, stored privately, and answered by email."
        />
        <ul className="mt-8 space-y-3 text-sm uppercase tracking-[0.12em]">
          {siteConfig.professionalLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-accent hover:text-accent-hover"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/resume" className="text-accent hover:text-accent-hover">
              Résumé
            </Link>
          </li>
        </ul>
      </div>
      <ContactForm />
    </Container>
  );
}

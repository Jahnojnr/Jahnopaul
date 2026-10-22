import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Contact form and professional links.",
  "/contact",
);

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr]">
      <PageIntro
        eyebrow="Contact"
        title="Discuss work, collaboration, or a teaching engagement."
        description="Share a short brief. Server-side email delivery and inquiry storage will arrive with the admin and Resend integration. This form already validates input and prepares a message you can send."
      />
      <ContactForm />
    </Container>
  );
}

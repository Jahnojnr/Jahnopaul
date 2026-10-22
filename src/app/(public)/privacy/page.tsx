import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Privacy",
  "Privacy policy for this portfolio.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Privacy"
        title="How this site treats personal information."
        description="This policy describes the current foundation of the site. It will be updated when contact storage, analytics, or authentication go live."
      />
      <div className="prose-editorial mt-12 max-w-2xl">
        <p>
          This public website currently serves editorial pages and a contact
          form. The form does not send data to a server. A composed message is
          prepared in the browser so you can send it yourself.
        </p>
        <p>
          When the contact service is connected, submissions will be stored for
          the site administrator and delivered by email. Only the information
          you choose to send — typically name, email, subject, and message —
          will be collected. That data will not be sold.
        </p>
        <p>
          Authentication for the future admin dashboard will use Supabase Auth
          and will be limited to a single administrator. Public visitors will
          only see published content.
        </p>
        <p>
          If you have a privacy request once server-side collection is enabled,
          use the contact page.
        </p>
      </div>
    </Container>
  );
}

import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Privacy",
  "What this portfolio collects, why, and how it is handled.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Privacy"
        title="How this site treats personal information."
        description="A short policy covering the contact form and the private administration area."
      />
      <div className="prose-editorial mt-12 max-w-2xl">
        <p>
          This website is an editorial portfolio. It does not use advertising
          trackers or analytics scripts, and reading a page does not create an
          account or a profile.
        </p>

        <p>
          The contact form is the only place personal information is sent. When
          you submit it, your name, email address, subject, and message are
          stored in the site database so the message can be answered, and a
          notification is sent by email to the site administrator. Messages are
          kept only as long as they are useful for that purpose, and they are
          never sold or shared for marketing.
        </p>

        <p>
          To limit automated abuse, submissions are rate-limited. The limit is
          keyed on a short salted digest of the connection address. The raw
          address is not stored in the database and is not written to logs by
          this application.
        </p>

        <p>
          The administration area is private and uses Supabase Auth. Only the
          site administrator can sign in, and public visitors can only read
          published content. Drafts, archived records, and inquiries are never
          served to anonymous visitors.
        </p>

        <p>
          If you want a message you have sent to be deleted, reply to the same
          thread or send a new request through the contact page and it will be
          removed.
        </p>
      </div>
    </Container>
  );
}

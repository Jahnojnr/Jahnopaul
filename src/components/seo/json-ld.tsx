import { siteConfig } from "@/config/site";
import { profile } from "@/lib/data/profile";
import { getSiteUrl } from "@/lib/seo/site-url";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.bio,
    url: getSiteUrl(),
    sameAs: siteConfig.professionalLinks.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

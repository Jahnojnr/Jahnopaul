import { HomePage } from "@/components/home/home-page";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  `${siteConfig.name} — ${siteConfig.headline}`,
  siteConfig.description,
  "/",
  { absoluteTitle: true },
);

export default function Page() {
  return (
    <>
      <PersonJsonLd />
      <HomePage />
    </>
  );
}

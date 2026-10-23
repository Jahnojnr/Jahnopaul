import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/seo/site-url";

export function createPageMetadata(
  title: string,
  description: string,
  path = "/",
  options?: { absoluteTitle?: boolean },
): Metadata {
  const canonical = path || "/";
  const url = getAbsoluteUrl(canonical);

  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: options?.absoluteTitle ? title : `${title} · ${siteConfig.name}`,
      description,
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: options?.absoluteTitle ? title : `${title} · ${siteConfig.name}`,
      description,
    },
    metadataBase: new URL(getSiteUrl()),
  };
}

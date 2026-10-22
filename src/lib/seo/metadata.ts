import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createPageMetadata(
  title: string,
  description: string,
  path = "",
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title: `${title} · ${siteConfig.name}`,
      description,
      type: "website",
    },
  };
}

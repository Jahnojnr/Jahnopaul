import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

// Self-hosted so the production build never depends on a live Google Fonts request.
const newsreader = localFont({
  src: [
    {
      path: "../../public/fonts/newsreader-variable-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "../../public/fonts/newsreader-variable-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sourceSans = localFont({
  src: [
    {
      path: "../../public/fonts/source-sans-3-variable-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/source-sans-3-variable-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-source-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.headline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.headline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-charcoal">
        {children}
      </body>
    </html>
  );
}

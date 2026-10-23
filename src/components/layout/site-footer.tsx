import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{siteConfig.name}.</p>
          <p className="mt-3 max-w-md text-muted">{siteConfig.description}</p>
        </div>
        <nav aria-label="Secondary" className="grid grid-cols-2 gap-x-6 gap-y-3">
          {siteConfig.footerNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink/80 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="page-shell flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:justify-between">
          <p>© {siteConfig.copyrightYear} {siteConfig.name}</p>
          <a
            href={siteConfig.githubUrl}
            className="hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

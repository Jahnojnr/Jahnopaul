"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuForPath, setMenuForPath] = useState<string | null>(null);
  const open = menuForPath === pathname;

  function isCurrent(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="border-b border-line">
      <div className="page-shell flex items-center justify-between gap-6 py-5">
        <Link href="/" className="font-serif text-xl tracking-tight text-charcoal">
          {siteConfig.name}.
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {siteConfig.navigation.map((item) => {
            const current = isCurrent(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm tracking-[0.08em] uppercase transition-colors",
                  current ? "text-accent" : "text-muted hover:text-charcoal",
                )}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.12em] text-charcoal md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setMenuForPath(open ? null : pathname)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-navigation"
          className="border-t border-line md:hidden"
          aria-label="Mobile"
        >
          <div className="page-shell flex flex-col py-3">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-12 py-3 text-base text-charcoal"
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

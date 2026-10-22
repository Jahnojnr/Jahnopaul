"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line">
      <div className="page-shell flex items-center justify-between gap-6 py-5">
        <Link href="/" className="font-serif text-xl tracking-tight text-charcoal">
          {siteConfig.name}.
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {siteConfig.navigation.map((item) => {
            const current =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
          onClick={() => setOpen((value) => !value)}
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
                onClick={() => setOpen(false)}
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

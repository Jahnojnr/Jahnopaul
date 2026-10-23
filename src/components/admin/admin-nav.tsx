"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
};

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration" className="text-sm">
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible">
        {items.map((item) => {
          const current =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="shrink-0 md:border-b md:border-line/70">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center whitespace-nowrap px-2 py-2 transition-colors md:px-0",
                  current
                    ? "text-charcoal md:font-medium"
                    : "text-muted hover:text-charcoal",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

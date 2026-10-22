import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center px-5 text-sm tracking-[0.04em] uppercase transition-colors",
        variant === "primary" &&
          "bg-accent text-paper hover:bg-accent-hover",
        variant === "secondary" &&
          "border border-charcoal/20 text-charcoal hover:border-accent hover:text-accent",
        variant === "text" &&
          "px-0 text-accent underline decoration-transparent underline-offset-4 hover:decoration-current",
        className,
      )}
    >
      {children}
    </Link>
  );
}

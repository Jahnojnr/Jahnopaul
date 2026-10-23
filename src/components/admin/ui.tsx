import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-charcoal md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className={cn("border border-line bg-paper", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-serif text-xl">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "min-h-10 w-full border border-line bg-white px-3 text-charcoal focus:border-accent focus:outline-none";

export const textareaClass =
  "w-full border border-line bg-white px-3 py-2 text-charcoal focus:border-accent focus:outline-none";

const statusStyles: Record<string, string> = {
  published: "border-accent/30 bg-accent-soft text-accent",
  draft: "border-line bg-ivory text-muted",
  archived: "border-line bg-white text-muted line-through",
  new: "border-accent/40 bg-accent text-paper",
  read: "border-line bg-ivory text-muted",
  replied: "border-accent/30 bg-accent-soft text-accent",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs uppercase tracking-[0.12em]",
        statusStyles[status] ?? "border-line bg-white text-muted",
      )}
    >
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      <p className="font-serif text-xl text-charcoal">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Flash({
  tone = "success",
  message,
}: {
  tone?: "success" | "error";
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      role="status"
      className={cn(
        "border px-4 py-3 text-sm",
        tone === "success"
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-accent/40 bg-white text-accent",
      )}
    >
      {message}
    </p>
  );
}

export function Pagination({
  basePath,
  page,
  perPage,
  total,
  params = {},
}: {
  basePath: string;
  page: number;
  perPage: number;
  total: number;
  params?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-line pt-4 text-sm">
      <span className="text-muted">
        Page {page} of {totalPages} · {total} item{total === 1 ? "" : "s"}
      </span>
      <span className="flex items-center gap-4">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="text-accent hover:text-accent-hover">
            Previous
          </Link>
        ) : (
          <span className="text-muted/50">Previous</span>
        )}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className="text-accent hover:text-accent-hover">
            Next
          </Link>
        ) : (
          <span className="text-muted/50">Next</span>
        )}
      </span>
    </nav>
  );
}

export function MetaRow({ items }: { items: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-center gap-2">
          <dt className="uppercase tracking-[0.12em]">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

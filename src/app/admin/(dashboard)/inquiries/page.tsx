import Link from "next/link";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import {
  AdminPageHeader,
  EmptyState,
  Flash,
  Pagination,
  StatusBadge,
  inputClass,
} from "@/components/admin/ui";
import { deleteInquiryAction, updateInquiryStatusAction } from "@/server/actions/inquiries";
import { listInquiries } from "@/server/inquiries";
import type { InquiryStatus } from "@/types/database";

type SearchParams = {
  status?: string;
  page?: string;
  saved?: string;
  error?: string;
};

const statuses = ["all", "new", "read", "replied", "archived"] as const;
type StatusFilter = (typeof statuses)[number];

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = (statuses.includes(params.status as StatusFilter) ? params.status : "all") as StatusFilter;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const result = await listInquiries({ status, page, perPage: 10 });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Inquiries"
        title="Messages from the contact form."
        description="Private to the administrator. Mark an inquiry as read or replied so nothing is left open."
      />

      <Flash message={params.saved} />
      <Flash tone="error" message={params.error} />

      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {statuses.map((option) => (
          <Link
            key={option}
            href={option === "all" ? "/admin/inquiries" : `/admin/inquiries?status=${option}`}
            className={
              option === status
                ? "border border-accent bg-accent px-3 py-1.5 text-sm text-paper"
                : "border border-line bg-paper px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent"
            }
          >
            {option === "all" ? "All" : statusLabels[option]}
          </Link>
        ))}
      </nav>

      {result.rows.length === 0 ? (
        <EmptyState
          title="No inquiries"
          description="Nothing has been submitted through the contact form with this filter."
        />
      ) : (
        <ul className="grid gap-4">
          {result.rows.map((inquiry) => (
            <li key={inquiry.id} className="border border-line bg-paper">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
                <div className="min-w-0">
                  <p className="font-serif text-xl text-charcoal">{inquiry.subject}</p>
                  <p className="mt-1 text-sm text-muted">
                    {inquiry.name} ·{" "}
                    <a href={`mailto:${inquiry.email}`} className="text-accent hover:text-accent-hover">
                      {inquiry.email}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inquiry.status} />
                  <time dateTime={inquiry.created_at} className="text-sm text-muted">
                    {new Date(inquiry.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <div className="grid gap-4 px-5 py-4">
                <p className="whitespace-pre-wrap text-ink/90">{inquiry.message}</p>

                <div className="flex flex-wrap items-end gap-4 border-t border-line pt-4">
                  <form action={updateInquiryStatusAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <div className="grid gap-1">
                      <label
                        htmlFor={`status-${inquiry.id}`}
                        className="text-xs uppercase tracking-[0.16em] text-muted"
                      >
                        Status
                      </label>
                      <select
                        id={`status-${inquiry.id}`}
                        name="status"
                        defaultValue={inquiry.status}
                        className={`${inputClass} w-40`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="min-h-10 border border-charcoal/20 px-3 text-sm uppercase tracking-[0.08em] text-charcoal hover:border-accent hover:text-accent"
                    >
                      Update
                    </button>
                  </form>

                  <a
                    href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.subject}`)}`}
                    className="inline-flex min-h-10 items-center text-sm uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                  >
                    Reply by email
                  </a>

                  <form action={deleteInquiryAction} className="ml-auto">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <ConfirmSubmit message="Delete this inquiry? This cannot be undone.">
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        basePath="/admin/inquiries"
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        params={{ status: status === "all" ? undefined : status }}
      />
    </div>
  );
}

export const instant = false;

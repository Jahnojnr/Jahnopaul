import Link from "next/link";
import {
  AdminPageHeader,
  EmptyState,
  MetaRow,
  Panel,
  StatusBadge,
} from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { getDashboardData } from "@/server/dashboard";

export default async function AdminOverviewPage() {
  const data = await getDashboardData();
  const published = data.projectCounts.published + data.postCounts.published;
  const drafts = data.projectCounts.draft + data.postCounts.draft;

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="What needs attention."
        description="Published work, open drafts, and recent inquiries at a glance."
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
          >
            New project
          </Link>
        }
      />

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published", value: published },
          { label: "Drafts", value: drafts },
          { label: "New inquiries", value: data.newInquiries },
          {
            label: "Projects",
            value:
              data.projectCounts.published +
              data.projectCounts.draft +
              data.projectCounts.archived,
          },
        ].map((stat) => (
          <div key={stat.label} className="border border-line bg-paper px-5 py-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">{stat.label}</dt>
            <dd className="mt-2 font-serif text-3xl text-charcoal">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <Panel
        title="Recent inquiries"
        description="Messages submitted through the contact form."
        actions={
          <Link href="/admin/inquiries" className="text-sm text-accent hover:text-accent-hover">
            All inquiries
          </Link>
        }
      >
        {data.recentInquiries.length === 0 ? (
          <EmptyState
            title="No inquiries yet"
            description="Messages from the public contact form will appear here. Inquiries are private and never shown on the public site."
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.recentInquiries.map((inquiry) => (
              <li key={inquiry.id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-charcoal">{inquiry.subject}</p>
                  <p className="truncate text-sm text-muted">
                    {inquiry.name} · {inquiry.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inquiry.status} />
                  <span className="text-sm text-muted">{formatDate(inquiry.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Unpublished work"
        description="Draft and archived records are never visible on the public site."
      >
        {data.recentDrafts.length === 0 ? (
          <EmptyState
            title="Nothing waiting"
            description="Every project and article is published. Create a draft to work on something new."
          />
        ) : (
          <ul className="divide-y divide-line">
            {data.recentDrafts.map((draft) => (
              <li key={`${draft.kind}-${draft.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <Link
                    href={
                      draft.kind === "project"
                        ? `/admin/projects/${draft.id}/edit`
                        : `/admin/writing/${draft.id}/edit`
                    }
                    className="text-charcoal hover:text-accent"
                  >
                    {draft.title}
                  </Link>
                  <MetaRow items={[["Type", draft.kind]]} />
                </div>
                <span className="text-sm text-muted">Edited {formatDate(draft.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export const instant = false;

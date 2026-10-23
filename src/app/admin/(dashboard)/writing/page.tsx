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
import { formatDate } from "@/lib/utils";
import { listPosts } from "@/server/posts";
import { deletePostAction, setPostStatusAction } from "@/server/actions/posts";

type SearchParams = {
  status?: string;
  q?: string;
  page?: string;
  saved?: string;
  error?: string;
};

const statuses = ["all", "published", "draft", "archived"] as const;
type StatusFilter = (typeof statuses)[number];

export default async function AdminWritingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = (statuses.includes(params.status as StatusFilter) ? params.status : "all") as StatusFilter;
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const result = await listPosts({ status, query, page, perPage: 10 });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Writing"
        title="Articles and drafts."
        description="Drafts stay private. Publishing makes the article available at its public URL and in the sitemap."
        actions={
          <Link
            href="/admin/writing/new"
            className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
          >
            New article
          </Link>
        }
      />

      <Flash message={params.saved} />
      <Flash tone="error" message={params.error} />

      <form className="flex flex-wrap items-end gap-3 border border-line bg-paper px-4 py-3">
        <div className="grid gap-1">
          <label htmlFor="q" className="text-xs uppercase tracking-[0.16em] text-muted">
            Search
          </label>
          <input id="q" name="q" defaultValue={query} placeholder="Title or slug" className={`${inputClass} md:w-64`} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="status" className="text-xs uppercase tracking-[0.16em] text-muted">
            Status
          </label>
          <select id="status" name="status" defaultValue={status} className={`${inputClass} md:w-44`}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button
          type="submit"
          className="min-h-10 border border-charcoal/20 px-4 text-sm uppercase tracking-[0.08em] text-charcoal hover:border-accent hover:text-accent"
        >
          Apply
        </button>
        {query || status !== "all" ? (
          <Link href="/admin/writing" className="text-sm text-muted hover:text-accent">
            Clear
          </Link>
        ) : null}
      </form>

      {result.rows.length === 0 ? (
        <EmptyState
          title={query || status !== "all" ? "No matching articles" : "No articles yet"}
          description={
            query || status !== "all"
              ? "Try a different search or status filter."
              : "Write the first piece. It stays private until you publish it."
          }
          action={
            <Link
              href="/admin/writing/new"
              className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
            >
              New article
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Article</th>
                <th scope="col" className="px-4 py-3 font-normal">Status</th>
                <th scope="col" className="px-4 py-3 font-normal">Updated</th>
                <th scope="col" className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.rows.map((post) => (
                <tr key={post.id} className="align-top">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/writing/${post.id}/edit`}
                      className="font-medium text-charcoal hover:text-accent"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-muted">/writing/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-4 text-muted">{formatDate(post.updated_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={`/admin/writing/${post.id}/edit`}
                        className="text-sm uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                      >
                        Edit
                      </Link>
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={post.status === "published" ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          className="min-h-8 text-sm uppercase tracking-[0.08em] text-muted hover:text-accent"
                        >
                          {post.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <ConfirmSubmit message={`Delete “${post.title}”? This cannot be undone.`}>
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        basePath="/admin/writing"
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        params={{ status: status === "all" ? undefined : status, q: query || undefined }}
      />
    </div>
  );
}

export const instant = false;

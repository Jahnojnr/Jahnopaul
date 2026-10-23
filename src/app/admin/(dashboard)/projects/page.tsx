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
import { listProjects } from "@/server/projects";
import {
  deleteProjectAction,
  setProjectFeaturedAction,
  setProjectStatusAction,
} from "@/server/actions/projects";

type SearchParams = {
  status?: string;
  q?: string;
  page?: string;
  saved?: string;
  error?: string;
};

const statuses = ["all", "published", "draft", "archived"] as const;
type StatusFilter = (typeof statuses)[number];

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = (statuses.includes(params.status as StatusFilter) ? params.status : "all") as StatusFilter;
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const result = await listProjects({ status, query, page, perPage: 10 });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Projects"
        title="Case studies and portfolio work."
        description="Draft quietly, publish deliberately. Archived projects disappear from the public site but keep their history."
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
          >
            New project
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
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Title or slug"
            className={`${inputClass} md:w-64`}
          />
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
          <Link href="/admin/projects" className="text-sm text-muted hover:text-accent">
            Clear
          </Link>
        ) : null}
      </form>

      {result.rows.length === 0 ? (
        <EmptyState
          title={query || status !== "all" ? "No matching projects" : "No projects yet"}
          description={
            query || status !== "all"
              ? "Try a different search or status filter."
              : "Create the first case study. It stays private until you publish it."
          }
          action={
            <Link
              href="/admin/projects/new"
              className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
            >
              New project
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Project</th>
                <th scope="col" className="px-4 py-3 font-normal">Status</th>
                <th scope="col" className="px-4 py-3 font-normal">Updated</th>
                <th scope="col" className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.rows.map((project) => (
                <tr key={project.id} className="align-top">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-medium text-charcoal hover:text-accent"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-0.5 text-muted">/projects/{project.slug}</p>
                    {project.featured ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-accent">Selected work</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-4 text-muted">{formatDate(project.updated_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-sm uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                      >
                        Edit
                      </Link>

                      <form action={setProjectStatusAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={project.status === "published" ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          className="min-h-8 text-sm uppercase tracking-[0.08em] text-muted hover:text-accent"
                        >
                          {project.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>

                      <form action={setProjectFeaturedAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <input type="hidden" name="featured" value={String(!project.featured)} />
                        <button
                          type="submit"
                          className="min-h-8 text-sm uppercase tracking-[0.08em] text-muted hover:text-accent"
                        >
                          {project.featured ? "Unfeature" : "Feature"}
                        </button>
                      </form>

                      <form action={deleteProjectAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <ConfirmSubmit message={`Delete “${project.title}”? This cannot be undone.`}>
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
        basePath="/admin/projects"
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        params={{ status: status === "all" ? undefined : status, q: query || undefined }}
      />
    </div>
  );
}

export const instant = false;

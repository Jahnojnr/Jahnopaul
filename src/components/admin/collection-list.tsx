import Link from "next/link";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { EmptyState } from "@/components/admin/ui";
import type { CollectionDefinition } from "@/lib/admin/collections";
import type { CollectionRow } from "@/server/collections";
import { deleteCollectionAction } from "@/server/actions/collections";

export function CollectionList({
  definition,
  rows,
}: {
  definition: CollectionDefinition;
  rows: CollectionRow[];
}) {
  const basePath = `/admin/${definition.slug}`;

  if (rows.length === 0) {
    return (
      <EmptyState
        title={`No ${definition.title.toLowerCase()} yet`}
        description={`Add the first ${definition.singular}. It appears on the public site as soon as it is saved.`}
        action={
          <Link
            href={`${basePath}/new`}
            className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
          >
            Add {definition.singular}
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto border border-line bg-paper">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-normal">Record</th>
            <th scope="col" className="px-4 py-3 font-normal">Order</th>
            <th scope="col" className="px-4 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => {
            const record = row as unknown as Record<string, unknown>;
            const title = String(record[definition.titleField] ?? "Untitled");
            const secondary = [record.role, record.credential, record.year, record.period]
              .find((value) => typeof value === "string" && value.length > 0) as
              | string
              | undefined;

            return (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-4">
                  <Link
                    href={`${basePath}/${row.id}/edit`}
                    className="font-medium text-charcoal hover:text-accent"
                  >
                    {title}
                  </Link>
                  {secondary ? <p className="mt-0.5 text-muted">{secondary}</p> : null}
                </td>
                <td className="px-4 py-4 text-muted">{String(record.sort_order ?? 0)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={`${basePath}/${row.id}/edit`}
                      className="text-sm uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                    >
                      Edit
                    </Link>
                    <form action={deleteCollectionAction}>
                      <input type="hidden" name="table" value={definition.table} />
                      <input type="hidden" name="id" value={row.id} />
                      <ConfirmSubmit message={`Delete “${title}”? This cannot be undone.`}>
                        Delete
                      </ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import Link from "next/link";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { CollectionList } from "@/components/admin/collection-list";
import { collections } from "@/lib/admin/collections";
import { listCollection } from "@/server/collections";

const definition = collections.education;

export default async function AdminCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const rows = await listCollection(definition.table);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow={definition.title}
        title={definition.description}
        description="Edits are saved directly to the public site. Keep only verifiable information here."
        actions={
          <Link
            href={`/admin/${definition.slug}/new`}
            className="inline-flex min-h-10 items-center bg-accent px-4 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
          >
            Add {definition.singular}
          </Link>
        }
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <CollectionList definition={definition} rows={rows} />
    </div>
  );
}

export const instant = false;

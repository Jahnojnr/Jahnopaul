import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { CollectionForm } from "@/components/admin/collection-form";
import { collections } from "@/lib/admin/collections";
import { getCollectionRow } from "@/server/collections";

const definition = collections.experiences;

export default async function EditCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const row = await getCollectionRow(definition.table, id);

  if (!row) {
    notFound();
  }

  const record = row as unknown as Record<string, unknown>;
  const title = String(record[definition.titleField] ?? "Record");

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow={`${definition.title} / Edit`}
        title={title}
        actions={
          <Link href={`/admin/${definition.slug}`} className="text-sm text-muted hover:text-accent">
            ← {definition.title}
          </Link>
        }
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <CollectionForm definition={definition} row={row} />
    </div>
  );
}

export const instant = false;

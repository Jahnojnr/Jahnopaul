import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui";
import { CollectionForm } from "@/components/admin/collection-form";
import { collections } from "@/lib/admin/collections";

const definition = collections.education;

export default function NewCollectionPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow={`${definition.title} / New`}
        title={`Add ${definition.singular}`}
        actions={
          <Link href={`/admin/${definition.slug}`} className="text-sm text-muted hover:text-accent">
            ← {definition.title}
          </Link>
        }
      />
      <CollectionForm definition={definition} />
    </div>
  );
}

export const instant = false;

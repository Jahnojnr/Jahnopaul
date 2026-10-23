import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, Flash, MetaRow } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getProject, getProjectTaxonomy } from "@/server/projects";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;

  const [detail, taxonomy] = await Promise.all([getProject(id), getProjectTaxonomy()]);

  if (!detail) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Projects / Edit"
        title={detail.project.title}
        description="Changes to a published project appear on the public site immediately."
        actions={
          <Link href="/admin/projects" className="text-sm text-muted hover:text-accent">
            ← All projects
          </Link>
        }
      />

      <MetaRow
        items={[
          ["Status", detail.project.status],
          ["Slug", `/projects/${detail.project.slug}`],
          ["Published", detail.project.published_at ? new Date(detail.project.published_at).toLocaleDateString("en-GB") : "Not published"],
        ]}
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <ProjectForm
        project={detail.project}
        categories={taxonomy.categories}
        technologies={taxonomy.technologies}
        selectedCategoryIds={detail.categoryIds}
        selectedTechnologyIds={detail.technologyIds}
      />
    </div>
  );
}

export const instant = false;

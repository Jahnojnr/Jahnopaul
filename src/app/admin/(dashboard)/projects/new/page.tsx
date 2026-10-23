import { AdminPageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectTaxonomy } from "@/server/projects";

export default async function NewProjectPage() {
  const { categories, technologies } = await getProjectTaxonomy();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Projects / New"
        title="Create a project."
        description="It starts as a draft. Publish when the case study is accurate and complete."
      />
      <ProjectForm
        categories={categories}
        technologies={technologies}
        selectedCategoryIds={[]}
        selectedTechnologyIds={[]}
      />
    </div>
  );
}

export const instant = false;

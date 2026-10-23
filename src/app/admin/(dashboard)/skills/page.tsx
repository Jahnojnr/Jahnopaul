import { AdminPageHeader, Flash, Panel } from "@/components/admin/ui";
import { SkillGroupEditor } from "@/components/admin/skill-group-editor";
import { listSkillGroups } from "@/server/collections";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const groups = await listSkillGroups();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Skills"
        title="Skill groups and their contents."
        description="Keep this list curated. A short, accurate set reads better than every tool ever used."
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      {groups.map((group) => (
        <Panel key={group.id} title={group.name} description={`${group.skills.length} skill${group.skills.length === 1 ? "" : "s"}`}>
          <SkillGroupEditor
            group={{
              id: group.id,
              name: group.name,
              sort_order: group.sort_order,
              skills: group.skills.map((skill) => skill.name),
            }}
          />
        </Panel>
      ))}

      <Panel title="Add a skill group" description="For example: Technical, Design, Professional.">
        <SkillGroupEditor />
      </Panel>
    </div>
  );
}

export const instant = false;

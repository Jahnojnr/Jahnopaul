import { ProjectFilters } from "@/components/projects/project-filters";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import {
  getProjectCategories,
  getProjectTechnologies,
  getPublishedProjects,
} from "@/lib/data/projects";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Projects",
  "Searchable project directory and case studies.",
  "/projects",
);

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Projects"
        title="Selected work across software, design, and education."
        description="Each case study records a role, a problem, a solution, and a concrete outcome. Use search and filters to move through the directory."
      />
      <ProjectFilters
        projects={getPublishedProjects()}
        categories={getProjectCategories()}
        technologies={getProjectTechnologies()}
      />
    </Container>
  );
}

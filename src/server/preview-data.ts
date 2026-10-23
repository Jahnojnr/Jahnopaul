import "server-only";

import { projects as sampleProjects, categories as sampleCategories, technologies as sampleTechnologies } from "@/lib/data/projects";
import { posts as samplePosts } from "@/lib/data/writing";
import {
  achievements as sampleAchievements,
  education as sampleEducation,
  experiences as sampleExperiences,
  services as sampleServices,
  skillGroups as sampleSkillGroups,
} from "@/lib/data/profile";
import type {
  AchievementRow,
  CategoryRow,
  EducationRow,
  ExperienceRow,
  PostRow,
  ProjectRow,
  ServiceRow,
  SkillGroupRow,
  SkillRow,
  TechnologyRow,
} from "@/types/database";

/**
 * Row-shaped sample content used only by the local read-only dashboard preview.
 * It is never used when Supabase is configured, and every mutation refuses to
 * run against it.
 */

const fallbackTimestamp = "2026-10-23T09:00:00.000Z";

export const previewProjects: ProjectRow[] = sampleProjects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  summary: project.summary,
  problem: project.problem,
  solution: project.solution,
  role: project.role,
  content: project.content.join("\n\n"),
  outcomes: project.outcomes,
  cover_image_path: null,
  cover_label: project.coverLabel,
  live_url: project.liveUrl ?? null,
  repository_url: project.repositoryUrl ?? null,
  status: project.status,
  featured: project.featured,
  sort_order: project.sortOrder,
  published_at:
    project.status === "published"
      ? new Date(project.publishedAt).toISOString()
      : null,
  created_at: new Date(project.publishedAt).toISOString(),
  updated_at: new Date(project.publishedAt).toISOString(),
}));

export const previewPosts: PostRow[] = samplePosts.map((post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  body: post.body.join("\n\n"),
  cover_image_path: null,
  status: post.status,
  featured: false,
  published_at:
    post.status === "published" ? new Date(post.publishedAt).toISOString() : null,
  created_at: new Date(post.publishedAt).toISOString(),
  updated_at: new Date(post.publishedAt).toISOString(),
}));

export const previewCategories: CategoryRow[] = sampleCategories;
export const previewTechnologies: TechnologyRow[] = sampleTechnologies;

export const previewExperiences: ExperienceRow[] = sampleExperiences.map(
  (experience) => ({
    id: experience.id,
    organization: experience.organization,
    role: experience.role,
    description: experience.description,
    start_date: experience.startDate,
    end_date: experience.endDate ?? null,
    is_current: experience.isCurrent,
    sort_order: experience.sortOrder,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  }),
);

export const previewSkillGroups: SkillGroupRow[] = sampleSkillGroups.map(
  (group, index) => ({
    id: group.id,
    name: group.name,
    sort_order: index + 1,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  }),
);

export const previewSkills: SkillRow[] = sampleSkillGroups.flatMap((group) =>
  group.skills.map((name, skillIndex) => ({
    id: `${group.id}-${skillIndex}`,
    group_id: group.id,
    name,
    sort_order: skillIndex + 1,
  })),
);

export const previewServices: ServiceRow[] = sampleServices.map((service, index) => ({
  id: service.id,
  title: service.title,
  summary: service.summary,
  details: service.details,
  sort_order: index + 1,
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}));

export const previewEducation: EducationRow[] = sampleEducation.map((item, index) => ({
  id: item.id,
  institution: item.institution,
  credential: item.credential,
  period: item.period,
  description: item.description,
  sort_order: index + 1,
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}));

export const previewAchievements: AchievementRow[] = sampleAchievements.map(
  (item, index) => ({
    id: item.id,
    title: item.title,
    year: item.year,
    description: item.description,
    sort_order: index + 1,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  }),
);

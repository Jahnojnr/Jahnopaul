import type { ContentStatus } from "@/types/content";

export type InquiryStatus = "new" | "read" | "replied" | "archived";

/**
 * Database row shapes. These mirror the SQL migrations in `supabase/migrations`
 * and are the only shapes the admin dashboard and server modules operate on.
 */

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  role: string;
  content: string;
  outcomes: string[];
  cover_image_path: string | null;
  cover_label: string;
  live_url: string | null;
  repository_url: string | null;
  status: ContentStatus;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_path: string | null;
  status: ContentStatus;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  organization: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SkillGroupRow = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SkillRow = {
  id: string;
  group_id: string;
  name: string;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EducationRow = {
  id: string;
  institution: string;
  credential: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CertificationRow = {
  id: string;
  title: string;
  issuer: string;
  issued_on: string | null;
  credential_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AchievementRow = {
  id: string;
  title: string;
  year: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MediaAssetRow = {
  id: string;
  storage_path: string;
  alt_text: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

export type ContactInquiryRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  long_bio: string;
  location: string | null;
  avatar_path: string | null;
  resume_path: string | null;
  social_links: Record<string, string>;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type TechnologyRow = {
  id: string;
  name: string;
  slug: string;
};

export type SiteSettingRow = {
  key: string;
  value: unknown;
  is_public: boolean;
  updated_at: string;
};

export type ContentStatus = "draft" | "published" | "archived";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Technology = {
  id: string;
  name: string;
  slug: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  role: string;
  content: string[];
  coverLabel: string;
  liveUrl?: string;
  repositoryUrl?: string;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  publishedAt: string;
  outcomes: string[];
  categories: Category[];
  technologies: Technology[];
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  status: ContentStatus;
  publishedAt: string;
};

export type Experience = {
  id: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  sortOrder: number;
};

export type SkillGroup = {
  id: string;
  name: string;
  skills: string[];
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  details: string[];
};

export type EducationItem = {
  id: string;
  institution: string;
  credential: string;
  period: string;
  description: string;
};

export type Achievement = {
  id: string;
  title: string;
  year: string;
  description: string;
};

export type ToolGroup = {
  id: string;
  name: string;
  items: string[];
};

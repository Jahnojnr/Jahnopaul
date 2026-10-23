import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedPosts } from "@/lib/data/writing";
import { getAbsoluteUrl } from "@/lib/seo/site-url";

const staticRoutes = [
  "/",
  ...siteConfig.navigation
    .map((item) => item.href)
    .filter((href) => href !== "/"),
  ...siteConfig.footerNavigation.map((item) => item.href),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const uniqueRoutes = [...new Set(staticRoutes)];

  const pages: MetadataRoute.Sitemap = uniqueRoutes.map((path) => ({
    url: getAbsoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const projects = getPublishedProjects().map((project) => ({
    url: getAbsoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const posts = getPublishedPosts().map((post) => ({
    url: getAbsoluteUrl(`/writing/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...projects, ...posts];
}

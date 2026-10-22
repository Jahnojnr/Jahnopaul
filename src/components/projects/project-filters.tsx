"use client";

import { useMemo, useState } from "react";
import type { Category, Project, Technology } from "@/types/content";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

type ProjectFiltersProps = {
  projects: Project[];
  categories: Category[];
  technologies: Technology[];
};

export function ProjectFilters({
  projects,
  categories,
  technologies,
}: ProjectFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [technology, setTechnology] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        needle.length === 0 ||
        `${project.title} ${project.summary} ${project.role}`
          .toLowerCase()
          .includes(needle);
      const matchesCategory =
        category === "all" ||
        project.categories.some((item) => item.slug === category);
      const matchesTechnology =
        technology === "all" ||
        project.technologies.some((item) => item.slug === technology);

      return matchesQuery && matchesCategory && matchesTechnology;
    });
  }, [projects, query, category, technology]);

  return (
    <div>
      <form
        className="grid gap-4 border-b border-line py-8 md:grid-cols-[1.4fr_1fr_1fr]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, role, or summary"
            className="mt-2 min-h-11 w-full border border-line bg-paper px-3 text-charcoal"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">
            Category
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 min-h-11 w-full border border-line bg-paper px-3 text-charcoal"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">
            Technology
          </span>
          <select
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
            className="mt-2 min-h-11 w-full border border-line bg-paper px-3 text-charcoal"
          >
            <option value="all">All technologies</option>
            {technologies.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      {filtered.length === 0 ? (
        <p className="py-16 text-muted">
          No published projects match those filters. Clear the search or choose
          another category.
        </p>
      ) : (
        <div>
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={`${String(index + 1).padStart(2, "0")} / ${String(filtered.length).padStart(2, "0")}`}
            />
          ))}
        </div>
      )}
      <p className={cn("pb-8 text-sm text-muted", filtered.length === 0 && "hidden")}>
        Showing {filtered.length} of {projects.length} published projects.
      </p>
    </div>
  );
}

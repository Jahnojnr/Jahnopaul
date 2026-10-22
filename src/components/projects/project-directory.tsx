"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Project, Technology } from "@/types/content";
import { CoverPlate } from "@/components/projects/cover-plate";

type ProjectDirectoryProps = {
  projects: Project[];
  categories: Category[];
  technologies: Technology[];
};

export function ProjectDirectory({
  projects,
  categories,
  technologies,
}: ProjectDirectoryProps) {
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
    <div className="mt-10">
      <form
        className="grid gap-4 border border-line bg-paper p-5 md:grid-cols-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="grid gap-2 text-sm">
          <span className="uppercase tracking-[0.14em] text-muted">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, role, or summary"
            className="min-h-11 border border-line bg-ivory px-3 text-charcoal"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="uppercase tracking-[0.14em] text-muted">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 border border-line bg-ivory px-3 text-charcoal"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="uppercase tracking-[0.14em] text-muted">Technology</span>
          <select
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
            className="min-h-11 border border-line bg-ivory px-3 text-charcoal"
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
        <p className="mt-10 text-muted">No published projects match those filters.</p>
      ) : (
        <ul className="mt-10 grid gap-10 md:grid-cols-2">
          {filtered.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <CoverPlate label={project.coverLabel} title={project.title} />
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
                  {project.categories.map((item) => item.name).join(" · ")}
                </p>
                <h2 className="mt-2 font-serif text-3xl group-hover:text-accent">
                  {project.title}
                </h2>
                <p className="mt-3 text-ink/80">{project.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

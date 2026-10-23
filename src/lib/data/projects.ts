import type { Category, Project, Technology } from "@/types/content";

export const categories: Category[] = [
  { id: "engineering", name: "Engineering", slug: "engineering" },
  { id: "product-design", name: "Product design", slug: "product-design" },
  { id: "education", name: "Education", slug: "education" },
  { id: "blockchain", name: "Blockchain", slug: "blockchain" },
];

export const technologies: Technology[] = [
  { id: "nextjs", name: "Next.js", slug: "nextjs" },
  { id: "typescript", name: "TypeScript", slug: "typescript" },
  { id: "postgres", name: "PostgreSQL", slug: "postgres" },
  { id: "figma", name: "Figma", slug: "figma" },
  { id: "solidity", name: "Solidity", slug: "solidity" },
  { id: "tailwind", name: "Tailwind CSS", slug: "tailwind" },
];

const bySlug = <T extends { slug: string }>(items: T[], slug: string) => {
  const item = items.find((entry) => entry.slug === slug);
  if (!item) {
    throw new Error(`Unknown slug: ${slug}`);
  }
  return item;
};

export const projects: Project[] = [
  {
    id: "proj-curriculum-studio",
    title: "Curriculum Studio",
    slug: "curriculum-studio",
    summary:
      "A structured environment for designing, sequencing, and publishing technology education programmes.",
    problem:
      "Course teams were assembling lessons across disconnected documents, which made quality review slow and outcomes difficult to measure.",
    solution:
      "A shared studio for modules, assessments, and publishing workflow, with a public catalogue that stays aligned to the latest approved version.",
    role: "Product design and full-stack engineering",
    content: [
      "Curriculum Studio started as a response to a practical teaching problem: strong material existed, but it lived in too many places to review, reuse, or improve with any discipline.",
      "The work combined information architecture, editorial interface design, and a publishing model that treats a course as a versioned product rather than a folder of files.",
      "The result is a quieter production environment for educators and a clearer reading experience for learners.",
    ],
    coverLabel: "Education platform",
    status: "published",
    featured: true,
    sortOrder: 1,
    publishedAt: "2025-09-12",
    outcomes: [
      "Reduced course assembly time from several days to a single review cycle",
      "Gave reviewers a consistent place to comment on structure, not just copy",
      "Published a public catalogue that stays in sync with approved modules",
    ],
    categories: [bySlug(categories, "education"), bySlug(categories, "engineering")],
    technologies: [
      bySlug(technologies, "nextjs"),
      bySlug(technologies, "typescript"),
      bySlug(technologies, "postgres"),
    ],
  },
  {
    id: "proj-ledger-brief",
    title: "Ledger Brief",
    slug: "ledger-brief",
    summary:
      "An explanatory product that turns on-chain activity into readable operational summaries for non-specialist teams.",
    problem:
      "Stakeholders needed to understand blockchain activity without reading raw transaction data or relying on informal screenshots.",
    solution:
      "A brief-style interface that groups events, names counterparties, and presents a narrative summary with links back to source records.",
    role: "Interface design and product engineering",
    content: [
      "Ledger Brief is an exercise in translation. The data is technical; the audience is not always technical. The design problem was to keep the source of truth intact while making the story readable.",
      "The interface uses an editorial layout rather than a dense dashboard: a headline, a period, a sequence of events, and supporting detail that can be opened when needed.",
      "That restraint is the point. The product is useful because it refuses to show everything at once.",
    ],
    coverLabel: "Blockchain briefing",
    status: "published",
    featured: true,
    sortOrder: 2,
    publishedAt: "2025-06-03",
    outcomes: [
      "Cut weekly reporting preparation from a half-day task to a short review",
      "Gave legal and operations teams a shared language for on-chain events",
      "Preserved an audit path from each summary back to source records",
    ],
    categories: [bySlug(categories, "blockchain"), bySlug(categories, "product-design")],
    technologies: [
      bySlug(technologies, "nextjs"),
      bySlug(technologies, "typescript"),
      bySlug(technologies, "solidity"),
    ],
  },
  {
    id: "proj-atelier-os",
    title: "Atelier OS",
    slug: "atelier-os",
    summary:
      "An internal operating system for a small studio: projects, proposals, and delivery notes in one editorial workspace.",
    problem:
      "Delivery notes, proposals, and project history were scattered, which made it hard to brief new work or learn from previous engagements.",
    solution:
      "A calm workspace that treats each engagement as a case file, with status, artefacts, and decisions kept in a single record.",
    role: "Design lead and application engineering",
    content: [
      "Atelier OS is the kind of tool a studio actually uses: not a generic project board, but a place to hold the thinking around a piece of work.",
      "Each engagement has a brief, a record of decisions, and a closing note. The visual language is closer to a publication than a kanban wall.",
      "Building it clarified a wider design principle for this portfolio: software can be quiet, structured, and still feel considered.",
    ],
    coverLabel: "Studio operations",
    status: "published",
    featured: true,
    sortOrder: 3,
    publishedAt: "2025-02-18",
    outcomes: [
      "Created a repeatable briefing format for new work",
      "Made previous decisions searchable instead of buried in chat",
      "Shortened the time needed to assemble a proposal from prior work",
    ],
    categories: [bySlug(categories, "product-design"), bySlug(categories, "engineering")],
    technologies: [
      bySlug(technologies, "nextjs"),
      bySlug(technologies, "tailwind"),
      bySlug(technologies, "figma"),
    ],
  },
  {
    id: "proj-field-notes",
    title: "Field Notes for Builders",
    slug: "field-notes-for-builders",
    summary:
      "A public writing and workshop series on software craft, product judgement, and teaching technical ideas clearly.",
    problem:
      "Technical explanations were either too abstract for newcomers or too informal to reuse as teaching material.",
    solution:
      "A set of long-form notes and workshop outlines with a consistent structure: context, decision, method, and what to try next.",
    role: "Author, curriculum design, and facilitation",
    content: [
      "Field Notes for Builders is the public teaching practice behind the studio work. It is not a dump of tutorials. Each note is written to be used in a room, then revised after it has been taught.",
      "The project sits at the intersection of writing, education, and product thinking. The measure of success is whether a reader can act, not whether the page looks busy.",
    ],
    coverLabel: "Teaching series",
    status: "published",
    featured: true,
    sortOrder: 4,
    publishedAt: "2024-11-08",
    outcomes: [
      "Produced a reusable outline for workshops and independent study",
      "Turned classroom feedback into a public editorial standard",
      "Created a body of writing that supports the project case studies",
    ],
    categories: [bySlug(categories, "education")],
    technologies: [bySlug(technologies, "nextjs"), bySlug(technologies, "figma")],
  },
  {
    id: "proj-draft-studio-notes",
    title: "Studio notes (draft)",
    slug: "studio-notes",
    summary: "An unpublished working note used to verify that drafts never appear in public listings.",
    problem: "Draft content must remain invisible until it is intentionally published.",
    solution: "Public helpers only return records with a published status.",
    role: "Internal verification",
    content: ["This record exists so the public site can prove draft filtering before the admin dashboard exists."],
    coverLabel: "Draft",
    status: "draft",
    featured: false,
    sortOrder: 99,
    publishedAt: "2026-10-23",
    outcomes: ["Confirms unpublished work is excluded from public routes"],
    categories: [bySlug(categories, "engineering")],
    technologies: [bySlug(technologies, "nextjs")],
  },
];

export function getPublishedProjects() {
  return projects
    .filter((project) => project.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjects() {
  return getPublishedProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string) {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getProjectCategories() {
  return categories;
}

export function getProjectTechnologies() {
  return technologies.filter((technology) =>
    getPublishedProjects().some((project) =>
      project.technologies.some((item) => item.id === technology.id),
    ),
  );
}

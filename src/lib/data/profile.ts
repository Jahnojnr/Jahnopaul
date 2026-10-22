import type {
  Achievement,
  EducationItem,
  Experience,
  Service,
  SkillGroup,
  ToolGroup,
} from "@/types/content";

export const profile = {
  name: "Jahno Paul",
  headline: "Software, design, and technology education",
  bio: "I work across software engineering, interface design, blockchain, and technology education. The through-line is the same: make complex systems intelligible, useful, and carefully presented.",
  longerBio: [
    "Jahno Paul is a multidisciplinary practitioner working at the intersection of software, design, and teaching. The work is equally concerned with how a system is built and how it is explained.",
    "Projects tend to start with a communication problem: a team cannot see the work, a learner cannot enter the subject, or a product cannot describe its own decisions. The response is usually a combination of research, interface design, and implementation.",
    "The values that shape the studio are clarity, restraint, and accountability. If a page, a product, or a lesson cannot say what it is for, it is not finished.",
  ],
  values: [
    {
      title: "Clarity over display",
      text: "A reader should know what the work is, who it served, and what changed. Visual polish is in service of that.",
    },
    {
      title: "Build and explain",
      text: "Implementation and teaching are not separate crafts here. A system that cannot be explained is incomplete.",
    },
    {
      title: "Measured ambition",
      text: "New capability is added when there is a real use for it. The platform grows in phases, not as a catalogue of unused features.",
    },
  ],
};

export const experiences: Experience[] = [
  {
    id: "exp-independent",
    organization: "Independent practice",
    role: "Software, design, and education",
    description:
      "Lead end-to-end work on products, teaching programmes, and editorial platforms: research, interface design, engineering, and publishing.",
    startDate: "2022-01-01",
    isCurrent: true,
    sortOrder: 1,
  },
  {
    id: "exp-product",
    organization: "Product and platform work",
    role: "Engineer and product designer",
    description:
      "Designed and built internal tools and public-facing products with an emphasis on information architecture, typed systems, and readable interfaces.",
    startDate: "2019-01-01",
    endDate: "2021-12-01",
    isCurrent: false,
    sortOrder: 2,
  },
  {
    id: "exp-teaching",
    organization: "Technology education",
    role: "Instructor and curriculum contributor",
    description:
      "Taught software and design fundamentals, wrote course material, and helped teams turn informal knowledge into structured programmes.",
    startDate: "2017-01-01",
    endDate: "2019-12-01",
    isCurrent: false,
    sortOrder: 3,
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "technical",
    name: "Technical",
    skills: ["TypeScript", "Next.js", "PostgreSQL", "System design", "Blockchain fundamentals"],
  },
  {
    id: "design",
    name: "Design",
    skills: ["Editorial interface design", "Information architecture", "Design systems", "Prototyping"],
  },
  {
    id: "professional",
    name: "Professional",
    skills: ["Curriculum design", "Technical writing", "Workshop facilitation", "Product discovery"],
  },
];

export const services: Service[] = [
  {
    id: "svc-product",
    title: "Product and interface design",
    summary: "Shape the structure, language, and visual system of a digital product.",
    details: [
      "Research and positioning",
      "Information architecture",
      "Interface design for complex content",
      "Design-to-engineering handoff",
    ],
  },
  {
    id: "svc-engineering",
    title: "Software engineering",
    summary: "Build typed, maintainable web applications with a clear content model.",
    details: [
      "Next.js application architecture",
      "Content systems and publishing workflows",
      "Integration with PostgreSQL-backed services",
      "Accessible, performant frontends",
    ],
  },
  {
    id: "svc-education",
    title: "Technology education",
    summary: "Turn specialist knowledge into programmes, workshops, and public writing.",
    details: [
      "Curriculum and workshop design",
      "Technical explanation and editorial standards",
      "Teaching for mixed-experience groups",
      "Review of existing learning material",
    ],
  },
];

export const education: EducationItem[] = [
  {
    id: "edu-practice",
    institution: "Independent study and studio practice",
    credential: "Software engineering, design, and teaching",
    period: "Ongoing",
    description:
      "Continuous practice across application engineering, editorial design, and the teaching of technical subjects.",
  },
  {
    id: "edu-training",
    institution: "Professional training",
    credential: "Selected certifications and short programmes",
    period: "2018 — 2025",
    description:
      "Targeted training in web platforms, design methods, and blockchain fundamentals, recorded as they become relevant to the work.",
  },
];

export const achievements: Achievement[] = [
  {
    id: "ach-studio",
    title: "Independent studio established",
    year: "2022",
    description:
      "Opened a practice covering software, design, and technology education rather than treating them as separate careers.",
  },
  {
    id: "ach-curriculum",
    title: "Published teaching programmes",
    year: "2024",
    description:
      "Turned workshop material into a reusable curriculum with a public writing series attached.",
  },
  {
    id: "ach-platform",
    title: "Portfolio platform in public build",
    year: "2026",
    description:
      "Began the public, phased build of this editorial portfolio, with content and admin systems introduced in sequence.",
  },
];

export const now = {
  updated: "October 2026",
  focus: [
    "Building this editorial portfolio in public, starting with the visual system and sample case studies.",
    "Refining a teaching method for software and product work that keeps the underlying idea intact.",
    "Preparing the content model and publishing workflow that will replace the current sample data.",
  ],
};

export const uses: ToolGroup[] = [
  {
    id: "building",
    name: "Building",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Git"],
  },
  {
    id: "designing",
    name: "Designing",
    items: ["Figma", "Paper notes", "A small set of typefaces used consistently"],
  },
  {
    id: "writing",
    name: "Writing and teaching",
    items: ["Long-form drafts", "Workshop outlines", "Case-study templates"],
  },
];

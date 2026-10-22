import type { Post } from "@/types/content";

export const posts: Post[] = [
  {
    id: "post-teaching-software",
    title: "Teaching software without flattening the idea",
    slug: "teaching-software-without-flattening-the-idea",
    excerpt:
      "A method for explaining technical systems so that beginners can enter and practitioners still find the argument worth reading.",
    body: [
      "Technical writing often fails in one of two ways. It becomes so gentle that the idea disappears, or so compressed that only people who already know the subject can follow it.",
      "The more useful approach is to keep the structure of the idea intact and change the order of entry. Start with the decision a reader has to make. Then show the model. Then show the implementation.",
      "That sequence is slower to write and much faster to teach. It is the editorial standard behind the notes and workshops on this site.",
    ],
    status: "published",
    publishedAt: "2026-03-14",
  },
  {
    id: "post-case-study-shape",
    title: "The shape of a useful case study",
    slug: "the-shape-of-a-useful-case-study",
    excerpt:
      "Role, problem, solution, and outcome are not a template to decorate. They are a way to keep a project honest.",
    body: [
      "A case study is not a gallery caption. It should tell a reader what was at stake, what was chosen, and what changed because of that choice.",
      "If an outcome cannot be measured, it can still be described precisely: a shorter path, a clearer brief, a decision that no longer has to be remade.",
      "The projects on this site are written to that standard. The visual treatment is secondary to the argument.",
    ],
    status: "published",
    publishedAt: "2025-12-02",
  },
  {
    id: "post-quiet-interfaces",
    title: "Quiet interfaces for serious work",
    slug: "quiet-interfaces-for-serious-work",
    excerpt:
      "Restraint is not a lack of ambition. It is a way of keeping attention on the content a product is meant to carry.",
    body: [
      "Many products add motion, cards, and colour because they are afraid of looking unfinished. The unfinished feeling usually comes from weak hierarchy, not from missing decoration.",
      "A serious interface needs readable type, a stable grid, and a small number of actions that are obviously the next step.",
      "That is the visual direction of this portfolio, and it is the same direction applied to the products documented here.",
    ],
    status: "published",
    publishedAt: "2025-08-21",
  },
];

export function getPublishedPosts() {
  return posts
    .filter((post) => post.status === "published")
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  return getPublishedPosts().find((post) => post.slug === slug);
}

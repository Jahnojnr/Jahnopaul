import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";
import { ArticleCard } from "@/components/writing/article-card";
import { getPublishedPosts } from "@/lib/data/writing";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Writing",
  "Articles, tutorials, and insights.",
  "/writing",
);

export default function WritingPage() {
  const posts = getPublishedPosts();

  return (
    <Container className="py-16">
      <PageIntro
        eyebrow="Writing"
        title="Articles, technical explanations, and lessons learned."
        description="Public notes from building, designing, and teaching. Each piece is written to be used, not merely collected."
      />
      <div className="mt-4">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </Container>
  );
}

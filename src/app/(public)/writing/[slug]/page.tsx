import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/writing";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Writing · {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-2xl text-xl text-ink/80">{post.excerpt}</p>
        <div className="prose-editorial mt-12 max-w-2xl">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-12">
          <ButtonLink href="/writing" variant="secondary">
            Back to writing
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}

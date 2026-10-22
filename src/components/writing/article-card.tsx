import Link from "next/link";
import type { Post } from "@/types/content";
import { formatDate } from "@/lib/utils";

type ArticleCardProps = {
  post: Post;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="border-t border-line py-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {formatDate(post.publishedAt)}
      </p>
      <h2 className="mt-3 font-serif text-3xl leading-tight">
        <Link href={`/writing/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-2xl text-ink/80">{post.excerpt}</p>
      <Link
        href={`/writing/${post.slug}`}
        className="mt-5 inline-flex text-sm uppercase tracking-[0.14em] text-accent hover:text-accent-hover"
      >
        Continue reading
      </Link>
    </article>
  );
}

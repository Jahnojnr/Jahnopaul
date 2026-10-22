import Link from "next/link";
import type { Post } from "@/types/content";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-t border-line py-8">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        {formatDate(post.publishedAt)}
      </p>
      <h3 className="mt-3 font-serif text-3xl leading-tight">
        <Link href={`/writing/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-2xl text-ink/80">{post.excerpt}</p>
    </article>
  );
}

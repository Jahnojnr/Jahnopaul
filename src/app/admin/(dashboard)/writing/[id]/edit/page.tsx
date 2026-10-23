import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, Flash, MetaRow } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";
import { getPost } from "@/server/posts";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Writing / Edit"
        title={post.title}
        actions={
          <Link href="/admin/writing" className="text-sm text-muted hover:text-accent">
            ← All articles
          </Link>
        }
      />

      <MetaRow
        items={[
          ["Status", post.status],
          ["Slug", `/writing/${post.slug}`],
          ["Published", post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB") : "Not published"],
        ]}
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <PostForm post={post} />
    </div>
  );
}

export const instant = false;

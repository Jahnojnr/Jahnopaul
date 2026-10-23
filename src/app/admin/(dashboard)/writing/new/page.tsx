import { AdminPageHeader } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Writing / New"
        title="Write an article."
        description="It starts as a draft, so nothing is public until you choose to publish."
      />
      <PostForm />
    </div>
  );
}

export const instant = false;

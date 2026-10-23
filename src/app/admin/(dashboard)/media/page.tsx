import Image from "next/image";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import {
  AdminPageHeader,
  EmptyState,
  Flash,
  MetaRow,
  Panel,
} from "@/components/admin/ui";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { deleteMediaAction } from "@/server/actions/media";
import { listMedia, publicMediaUrl } from "@/server/media";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const assets = await listMedia();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Media"
        title="Images and documents."
        description="Files live in Supabase Storage; the database keeps their metadata. Every image needs alt text and a descriptive filename."
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <Panel title="Upload" description="Uploads are limited to 5 MB and checked on the server.">
        <MediaUploadForm />
      </Panel>

      <Panel title="Library" description={`${assets.length} file${assets.length === 1 ? "" : "s"}`}>
        {assets.length === 0 ? (
          <EmptyState
            title="No files yet"
            description="Upload a project cover, article image, or the résumé PDF. Copy its storage path into the matching record."
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {assets.map((asset) => {
              const url = publicMediaUrl(asset.storage_path);
              const isImage = asset.mime_type.startsWith("image/");

              return (
                <li key={asset.id} className="border border-line bg-white">
                  {url && isImage ? (
                    <Image
                      src={url}
                      alt={asset.alt_text}
                      width={640}
                      height={360}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center bg-ivory text-sm text-muted">
                      {asset.mime_type || "File"}
                    </div>
                  )}
                  <div className="grid gap-2 px-4 py-3">
                    <p className="break-all text-sm text-charcoal">{asset.storage_path}</p>
                    <p className="text-sm text-muted">{asset.alt_text || "No alt text"}</p>
                    <MetaRow
                      items={[
                        ["Size", `${Math.max(1, Math.round(asset.file_size / 1024))} KB`],
                        ["Type", asset.mime_type],
                      ]}
                    />
                    <div className="flex flex-wrap items-center gap-4">
                      <form action={deleteMediaAction}>
                        <input type="hidden" name="id" value={asset.id} />
                        <ConfirmSubmit message="Delete this file and its record? Pages using it will lose the image.">
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export const instant = false;

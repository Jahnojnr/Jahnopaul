-- Storage bucket for project covers, article covers, profile media, and the
-- résumé PDF. Uploads and deletions are administrator-only; reads are public
-- because every published page needs the assets.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads media objects" on storage.objects;
create policy "Public reads media objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Administrator uploads media objects" on storage.objects;
create policy "Administrator uploads media objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Administrator updates media objects" on storage.objects;
create policy "Administrator updates media objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Administrator deletes media objects" on storage.objects;
create policy "Administrator deletes media objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_admin());

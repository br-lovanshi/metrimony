-- It looks like the Storage policies were missing from your last run.
-- This script fixes the "row-level security policy" error for PHOTO UPLOADS.

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- 2. Allow public uploads to this bucket
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads"
on storage.objects for insert
to anon, authenticated
with check ( bucket_id = 'profile-photos' );

-- 3. Allow public viewing of images in this bucket
drop policy if exists "Allow public viewing" on storage.objects;
create policy "Allow public viewing"
on storage.objects for select
to anon, authenticated
using ( bucket_id = 'profile-photos' );

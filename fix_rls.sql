-- Run this script in the Supabase SQL Editor to fix the permission errors

-- 1. Reset RLS on the profiles table
alter table public.profiles enable row level security;

-- 2. Allow ANYONE (public) to submit (insert) a profile
drop policy if exists "Enable insert for everyone" on public.profiles;
create policy "Enable insert for everyone"
on public.profiles for insert
to anon, authenticated
with check (true);

-- 3. Allow ANYONE to view ONLY 'approved' profiles
drop policy if exists "Enable read access for approved profiles" on public.profiles;
create policy "Enable read access for approved profiles"
on public.profiles for select
to anon, authenticated
using (status = 'approved');

-- 4. Allow ADMINS (authenticated users) to do EVERYTHING (view, update, delete all)
drop policy if exists "Enable all access for admins" on public.profiles;
create policy "Enable all access for admins"
on public.profiles for all
to authenticated
using (true)
with check (true);

-- STORAGE POLICIES (Fixes image upload issues)
-- Ensure you have created a bucket named 'profile-photos' and made it PUBLIC before running this.

-- 5. Allow anyone to upload permission to the bucket
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads"
on storage.objects for insert
to anon, authenticated
with check ( bucket_id = 'profile-photos' );

-- 6. Allow anyone to view images
drop policy if exists "Allow public viewing" on storage.objects;
create policy "Allow public viewing"
on storage.objects for select
to anon, authenticated
using ( bucket_id = 'profile-photos' );

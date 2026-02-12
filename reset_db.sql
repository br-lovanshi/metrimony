-- WARNING: This script will delete all existing data in the 'profiles' table.
-- Use this to completely reset your database state and fix permission errors.

-- 1. DROP EVERYTHING to start fresh
drop table if exists public.profiles cascade;

-- 2. RECREATE the 'profiles' table
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  age int2,
  gender text,
  education text,
  job text,
  location text,
  contact text,
  bio text,
  photo_url text,
  status text default 'pending'
);

-- 3. ENABLE Security
alter table public.profiles enable row level security;

-- 4. CREATE POLICIES (Simplified and Permissive)

-- Allow ANYONE to submit (insert) a profile
create policy "Enable insert for everyone"
on public.profiles for insert
to anon, authenticated
with check (true);

-- Allow ANYONE to view status='approved' profiles
create policy "Enable read access for approved profiles"
on public.profiles for select
to anon, authenticated
using (status = 'approved');

-- Allow ADMINS (authenticated) to do EVERYTHING
create policy "Enable all access for admins"
on public.profiles for all
to authenticated
using (true)
with check (true);

-- 5. STORAGE SETUP (Idempotent)
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- 6. STORAGE POLICIES
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads"
on storage.objects for insert
to anon, authenticated
with check ( bucket_id = 'profile-photos' );

drop policy if exists "Allow public viewing" on storage.objects;
create policy "Allow public viewing"
on storage.objects for select
to anon, authenticated
using ( bucket_id = 'profile-photos' );

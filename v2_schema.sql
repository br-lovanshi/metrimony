-- V2 SCHEMA UPGRADE FOR LODHA SAMAJ MATRIMONY
-- WARNING: THIS WILL DELETE ALL EXISTING PROFILES DATA

-- 1. CLEANUP
drop table if exists public.profiles cascade;

-- 2. CREATE NEW TABLE
create table public.profiles (
  -- System Fields
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending', -- pending | approved | rejected
  
  -- Required Fields
  full_name text not null,
  age int2 not null,
  gender text not null, -- Male | Female
  education text not null,
  height_inch int2 not null,
  manglik boolean default false,
  blood_group text,
  father_name text not null,
  family_gotra text not null,
  address text not null,
  mobile text not null,
  email text not null,
  self_photo_url text,
  family_photo_url text,
  expectations text not null,

  -- Optional Fields
  occupation text,
  work_experience text,
  income numeric,
  hobbies text,
  father_occupation text,
  mother_occupation text,
  siblings_details text,
  social_links text
);

-- 3. ENABLE RLS
alter table public.profiles enable row level security;

-- 4. POLICIES
-- Allow ANYONE to submit
create policy "Enable insert for everyone" on public.profiles for insert with check (true);

-- Allow VIEWING only approved
create policy "Enable read access for approved profiles" on public.profiles for select using (status = 'approved');

-- Allow ADMINS full access
create policy "Enable all access for admins" on public.profiles for all to authenticated using (true);

-- 5. STORAGE (Idempotent)
insert into storage.buckets (id, name, public) 
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads" on storage.objects for insert to anon, authenticated with check ( bucket_id = 'profile-photos' );

drop policy if exists "Allow public viewing" on storage.objects;
create policy "Allow public viewing" on storage.objects for select to anon, authenticated using ( bucket_id = 'profile-photos' );

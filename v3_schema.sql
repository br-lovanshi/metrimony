-- V3 SCHEMA UPGRADE FOR LODHA SAMAJ MATRIMONY
-- WARNING: THIS WILL DELETE ALL EXISTING DATA

-- 1. CLEANUP OLD TABLES
drop table if exists public.profiles cascade;
drop table if exists public.society_updates cascade;
drop table if exists public.samaj_connect_requests cascade;

-- 2. CREATE PROFILES TABLE (V3)
create table public.profiles (
  -- System Fields
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending', -- pending | approved | rejected
  
  -- Required Personal Fields
  full_name text not null,
  age int2 not null,
  gender text not null, -- Male | Female
  rashifal_symbol text not null, -- NEW: Zodiac/Rashifal
  
  -- Physical
  height_inch int2 not null,
  blood_group text,
  manglik boolean default false,

  -- Family & Gotra (CRITICAL)
  father_name text not null,
  father_gotra text not null, -- NEW
  mother_gotra text not null, -- NEW
  family_gotra text not null, -- Self Gotra

  -- Education, Career & Income
  education text not null,
  occupation text,
  income_lakh numeric, -- NEW: Stored as Lakhs (e.g. 1.5, 10, 50)
  work_experience text,

  -- Contact & Location
  address text not null,
  mobile text not null,
  email text not null,
  social_media_link text, -- NEW
  
  -- Photos & Bio
  self_photo_url text,
  family_photo_url text,
  expectations text not null,
  hobbies text,
  
  -- Additional Family Info
  father_occupation text,
  mother_occupation text,
  siblings_details text
);

-- 3. CREATE SOCIETY UPDATES TABLE (V3)
create table public.society_updates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  created_by uuid references auth.users(id)
);

-- 4. CREATE SAMAJ CONNECT REQUESTS TABLE (V3)
create table public.samaj_connect_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  age int2 not null,
  mobile text not null,
  email text,
  address text not null,
  state text not null,
  district text not null,
  block_tehsil text not null,
  status text default 'pending' -- pending | contacted
);

-- 5. ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.society_updates enable row level security;
alter table public.samaj_connect_requests enable row level security;

-- 6. POLICIES

-- PROFILES:
-- Public Insert
create policy "Enable insert for everyone" on public.profiles for insert with check (true);
-- Public Read Approved
create policy "Enable read access for approved profiles" on public.profiles for select using (status = 'approved');
-- Admin Full Access
create policy "Enable all access for admins" on public.profiles for all to authenticated using (true);

-- SOCIETY UPDATES:
-- Public Read
create policy "Enable read access for public" on public.society_updates for select using (true);
-- Admin Only Insert/Update/Delete
create policy "Enable write access for admins" on public.society_updates for all to authenticated using (true);

-- SAMAJ CONNECT:
-- Public Insert
create policy "Enable insert for everyone" on public.samaj_connect_requests for insert with check (true);
-- Admin Read/Update
create policy "Enable access for admins" on public.samaj_connect_requests for all to authenticated using (true);

-- 7. STORAGE POLICIES (Idempotent)
insert into storage.buckets (id, name, public) 
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads" on storage.objects for insert to anon, authenticated with check ( bucket_id = 'profile-photos' );

drop policy if exists "Allow public viewing" on storage.objects;
create policy "Allow public viewing" on storage.objects for select to anon, authenticated using ( bucket_id = 'profile-photos' );

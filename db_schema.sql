-- 1. Create the 'profiles' table
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

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create Policy: Allow anyone to view 'approved' profiles
create policy "Public profiles are viewable by everyone"
on public.profiles for select
to anon, authenticated
using (status = 'approved');

-- 4. Create Policy: Allow anyone to insert (submit) a profile
create policy "Anyone can insert a profile"
on public.profiles for insert
to anon, authenticated
with check (true);

-- 5. Create Policy: Allow authenticated (admin) users to do everything
create policy "Admins can do everything"
on public.profiles for all
to authenticated
using (true)
with check (true);

-- 6. Storage Bucket Setup (You might need to do this in the Dashboard GUI if SQL fails)
insert into storage.buckets (id, name, public) 
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- 7. Storage Policy: Allow anyone to upload photos
create policy "Anyone can upload profile photos"
on storage.objects for insert
to anon, authenticated
with check ( bucket_id = 'profile-photos' );

-- 8. Storage Policy: Allow anyone to view photos
create policy "Anyone can view profile photos"
on storage.objects for select
to anon, authenticated
using ( bucket_id = 'profile-photos' );

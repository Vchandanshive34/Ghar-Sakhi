-- GharSakhi Ulwe -- Supabase schema for the waitlist form
-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor -> New query -> paste -> Run).

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  sector text not null,
  services text,
  notes text
);

-- Row Level Security: locked down by default. We only open up INSERT
-- to anonymous visitors (the public website) -- nobody can read, edit,
-- or delete rows using the public "anon" key. You'll view signups from
-- the Supabase dashboard's Table Editor, logged in as the project owner
-- (that view isn't subject to these policies).
alter table public.waitlist_signups enable row level security;

create policy "Public can insert waitlist signups"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);

-- No select / update / delete policy is created for "anon" on purpose --
-- with RLS enabled and no matching policy, those actions are refused.

-- ------------------------------------------------------------------
-- Dashboard access: ONE signed-in Supabase Auth user (the founder) can
-- read every row. Nobody else -- including any other logged-in user --
-- can, since this policy checks the exact email on their auth token.
--
-- Setup: Authentication -> Users -> Add user, using this same email
-- and a password you choose. That becomes the only login the
-- dashboard (dashboard.html) will accept.
--
-- Change the email below FIRST if gharsakhiofficial@gmail.com isn't
-- the address you want signing into the dashboard.
-- ------------------------------------------------------------------
create policy "Admin can read all waitlist signups"
  on public.waitlist_signups
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'gharsakhiofficial@gmail.com');

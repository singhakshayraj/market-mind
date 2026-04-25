-- Run this in the Supabase SQL editor to create the reports table

create table if not exists reports (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  idea_text   text not null,
  geography   text,
  industry    text,
  modules     jsonb not null default '{}'
);

-- Allow public read of reports by ID (for shareable links)
alter table reports enable row level security;

create policy "Public read by ID"
  on reports for select
  using (true);

create policy "Service role insert"
  on reports for insert
  with check (true);

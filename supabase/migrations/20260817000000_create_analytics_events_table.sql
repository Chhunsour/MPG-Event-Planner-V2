-- Migration: Create analytics_events table and RLS policies
-- Date: 2026-08-17

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_type text not null default 'page_view',
  path text not null,
  referrer text,
  browser text,
  os text,
  device_type text,
  locale text default 'en',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_path_idx on public.analytics_events(path);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id);

alter table public.analytics_events enable row level security;

-- Allow anonymous inserts from client/api
drop policy if exists "Allow public insert for analytics_events" on public.analytics_events;
create policy "Allow public insert for analytics_events"
  on public.analytics_events
  for insert
  with check (true);

-- Allow authenticated users to select analytics
drop policy if exists "Allow crew to select analytics_events" on public.analytics_events;
create policy "Allow crew to select analytics_events"
  on public.analytics_events
  for select
  using (
    auth.role() = 'authenticated'
  );

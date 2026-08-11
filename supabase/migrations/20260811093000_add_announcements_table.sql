-- Migration: Add Announcements / Notification Bar table for Header Alerts
-- Date: 2026-08-11

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en": "📢 Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!", "km": "📢 បើកទទួលការកក់សម្រាប់ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធឆ្នាំ ២០២៦!", "zh": "📢 2026年柬埔寨企业典礼与开业仪式策划现已全面开放预订！"}'::jsonb,
  link text default '/contact',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.announcements enable row level security;

-- Drop existing policies if any
drop policy if exists "announcements_public_read" on public.announcements;
drop policy if exists "announcements_admin_all" on public.announcements;

-- Allow public read access for active announcements
create policy "announcements_public_read" on public.announcements
  for select using (is_active = true);

-- Allow authenticated admins full access
create policy "announcements_admin_all" on public.announcements
  for all using (auth.role() = 'authenticated');

-- Insert initial active announcement record
insert into public.announcements (title, link, is_active)
values (
  '{"en": "📢 Booking open for 2026 Corporate Ceremonies & Grand Openings across Cambodia!", "km": "📢 បើកទទួលការកក់សម្រាប់ការរៀបចំកម្មវិធី និងពិធីបើកសម្ពោធឆ្នាំ ២០២៦!", "zh": "📢 2026年柬埔寨企业典礼与开业仪式策划现已全面开放预订！"}'::jsonb,
  '/contact',
  true
)
on conflict do nothing;

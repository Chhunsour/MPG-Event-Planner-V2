-- Migration: Security, RBAC Crew System, Activity Logging & RLS Audit
-- Date: 2026-08-11

-- 1. Extend public.profiles table for RBAC role and status management
alter table public.profiles
  add column if not exists role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  add column if not exists status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
  add column if not exists invited_by uuid references public.profiles(id) on delete set null,
  add column if not exists invited_at timestamptz;

-- Migrate existing is_admin = true to 'owner', others to 'editor'
update public.profiles
set role = case when is_admin = true then 'owner' else 'editor' end
where role = 'editor';

-- 2. Create public.crew_invitations table for seamless email invitations
create table if not exists public.crew_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  invited_by uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

-- 3. Create public.activity_logs table for audit logging
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,
  target_type text not null,
  target_id text,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_user_idx on public.activity_logs(user_id);
create index if not exists activity_logs_created_idx on public.activity_logs(created_at desc);
create index if not exists crew_invitations_token_idx on public.crew_invitations(token);
create index if not exists crew_invitations_email_idx on public.crew_invitations(email);

-- 4. Security Definer Helper Functions in private schema
create or replace function private.get_user_role(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select role from public.profiles where id = p_user_id and status = 'active'),
    'none'
  );
$$;

create or replace function private.is_crew_active(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id and status = 'active'
  );
$$;

create or replace function private.has_role(p_user_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and status = 'active'
      and role = any(p_roles)
  );
$$;

create or replace function private.is_owner(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and status = 'active'
      and role = 'owner'
  );
$$;

-- Grant permissions for private functions to authenticated
grant execute on function private.get_user_role(uuid) to authenticated;
grant execute on function private.is_crew_active(uuid) to authenticated;
grant execute on function private.has_role(uuid, text[]) to authenticated;
grant execute on function private.is_owner(uuid) to authenticated;

-- Function for active crew to log activity securely
create or replace function public.log_activity(
  p_action text,
  p_target_type text,
  p_target_id text default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_email text;
  v_log_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null or not private.is_crew_active(v_user_id) then
    raise exception 'Unauthorized activity logging attempt';
  end if;

  select email into v_email from auth.users where id = v_user_id;

  insert into public.activity_logs (user_id, user_email, action, target_type, target_id, details)
  values (v_user_id, v_email, p_action, p_target_type, p_target_id, p_details)
  returning id into v_log_id;

  return v_log_id;
end;
$$;

grant execute on function public.log_activity(text, text, text, jsonb) to authenticated;

-- Prevent removing or demoting the last active owner
create or replace function private.prevent_last_owner_removal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_count integer;
begin
  if (TG_OP = 'DELETE' and OLD.role = 'owner' and OLD.status = 'active') or
     (TG_OP = 'UPDATE' and OLD.role = 'owner' and OLD.status = 'active' and (NEW.role != 'owner' or NEW.status != 'active')) then
    
    select count(*) into v_owner_count
    from public.profiles
    where role = 'owner' and status = 'active' and id != OLD.id;

    if v_owner_count = 0 then
      raise exception 'Operation forbidden: cannot remove or demote the last remaining active Owner account.';
    end if;
  end if;

  if TG_OP = 'DELETE' then
    return OLD;
  else
    return NEW;
  end if;
end;
$$;

drop trigger if exists ensure_last_owner_protection on public.profiles;
create trigger ensure_last_owner_protection
  before update or delete on public.profiles
  for each row execute function private.prevent_last_owner_removal();

-- 5. Enable and Update RLS Policies for All Tables

-- PROFILES
alter table public.profiles enable row level security;
drop policy if exists "profiles_read_own" on public.profiles;
drop policy if exists "profiles_admin_read" on public.profiles;
drop policy if exists "profiles_crew_read" on public.profiles;
drop policy if exists "profiles_owner_admin_manage" on public.profiles;

create policy "profiles_crew_read" on public.profiles
  for select to authenticated
  using (private.is_crew_active(auth.uid()));

create policy "profiles_owner_admin_manage" on public.profiles
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']))
  with check (private.has_role(auth.uid(), array['owner', 'admin']));

-- CREW INVITATIONS
alter table public.crew_invitations enable row level security;
drop policy if exists "invitations_crew_manage" on public.crew_invitations;
drop policy if exists "invitations_anon_read_token" on public.crew_invitations;

create policy "invitations_crew_manage" on public.crew_invitations
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']))
  with check (private.has_role(auth.uid(), array['owner', 'admin']));

create policy "invitations_anon_read_token" on public.crew_invitations
  for select to anon, authenticated
  using (status = 'pending' and expires_at > now());

-- ACTIVITY LOGS
alter table public.activity_logs enable row level security;
drop policy if exists "activity_logs_owner_admin_read" on public.activity_logs;

create policy "activity_logs_owner_admin_read" on public.activity_logs
  for select to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']));

-- SERVICES, PROJECTS, BLOG POSTS
drop policy if exists "services_admin_all" on public.services;
create policy "services_crew_write" on public.services
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin', 'editor']))
  with check (private.has_role(auth.uid(), array['owner', 'admin', 'editor']));

drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_crew_write" on public.projects
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin', 'editor']))
  with check (private.has_role(auth.uid(), array['owner', 'admin', 'editor']));

drop policy if exists "blog_admin_all" on public.blog_posts;
create policy "blog_crew_write" on public.blog_posts
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin', 'editor']))
  with check (private.has_role(auth.uid(), array['owner', 'admin', 'editor']));

-- QUOTATIONS
drop policy if exists "quotations_admin_read" on public.quotations;
drop policy if exists "quotations_admin_update" on public.quotations;
drop policy if exists "quotations_admin_delete" on public.quotations;

create policy "quotations_crew_read" on public.quotations
  for select to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin', 'editor', 'viewer']));

create policy "quotations_crew_update" on public.quotations
  for update to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin', 'editor']))
  with check (private.has_role(auth.uid(), array['owner', 'admin', 'editor']));

create policy "quotations_owner_admin_delete" on public.quotations
  for delete to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']));

-- SITE SETTINGS & ANNOUNCEMENTS
drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_owner_admin_manage" on public.site_settings
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']))
  with check (private.has_role(auth.uid(), array['owner', 'admin']));

drop policy if exists "announcements_admin_all" on public.announcements;
create policy "announcements_owner_admin_manage" on public.announcements
  for all to authenticated
  using (private.has_role(auth.uid(), array['owner', 'admin']))
  with check (private.has_role(auth.uid(), array['owner', 'admin']));

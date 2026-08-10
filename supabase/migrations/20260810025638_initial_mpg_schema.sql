-- MPG Event Planner: hosted Supabase schema.
-- This migration intentionally has no seed users and no local-database assumptions.

create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create table public.services (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title jsonb not null default '{"en":""}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  cover_image text,
  gallery text[] not null default '{}',
  display_order integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title jsonb not null default '{}'::jsonb,
  seo_description jsonb not null default '{}'::jsonb,
  image_alt jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.projects (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title jsonb not null default '{"en":""}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  category text,
  client_name text,
  location text,
  event_date date,
  cover_image text,
  gallery text[] not null default '{}',
  display_order integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title jsonb not null default '{}'::jsonb,
  seo_description jsonb not null default '{}'::jsonb,
  image_alt jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.blog_posts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title jsonb not null default '{"en":""}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  cover_image text,
  category text,
  tags text[] not null default '{}',
  author_name text,
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title jsonb not null default '{}'::jsonb,
  seo_description jsonb not null default '{}'::jsonb,
  image_alt jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default ('MPG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  customer_name text not null,
  company_name text,
  phone text not null,
  email text,
  preferred_contact_method text not null default 'telegram',
  event_type text not null default 'other',
  event_date date,
  event_location text not null,
  estimated_guests text,
  estimated_budget text,
  required_services text[] not null default '{}',
  additional_information text,
  language text not null default 'en' check (language in ('en', 'km', 'zh')),
  status text not null default 'new' check (status in ('new', 'contacted', 'completed', 'archived')),
  is_read boolean not null default false,
  internal_notes text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.translation_cache (
  cache_key text primary key,
  source_text text not null,
  translated_text text not null,
  target_locale text not null check (target_locale in ('km', 'zh')),
  format text not null check (format in ('text', 'html')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index services_published_order_idx on public.services (display_order, id)
  where is_published = true;
create index projects_published_order_idx on public.projects (display_order, id)
  where is_published = true;
create index projects_featured_idx on public.projects (display_order, id)
  where is_published = true and is_featured = true;
create index blog_posts_published_idx on public.blog_posts (published_at desc, id desc)
  where is_published = true;
create index quotations_status_created_idx on public.quotations (status, created_at desc);
create index quotations_created_idx on public.quotations (created_at desc);

create trigger services_updated_at before update on public.services
  for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function private.set_updated_at();
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function private.set_updated_at();
create trigger quotations_updated_at before update on public.quotations
  for each row execute function private.set_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger translation_cache_updated_at before update on public.translation_cache
  for each row execute function private.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function private.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and is_admin = true
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;
grant usage on schema private to authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated, service_role;
revoke all on function private.set_updated_at() from public, anon, authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.quotations enable row level security;
alter table public.translation_cache enable row level security;
alter table public.site_settings enable row level security;

create policy "profiles_read_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_admin_read" on public.profiles
  for select to authenticated
  using ((select private.is_admin()));

create policy "services_public_read_published" on public.services
  for select to anon, authenticated
  using (is_published = true and (published_at is null or published_at <= now()));
create policy "services_admin_all" on public.services
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "projects_public_read_published" on public.projects
  for select to anon, authenticated
  using (is_published = true and (published_at is null or published_at <= now()));
create policy "projects_admin_all" on public.projects
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "blog_public_read_published" on public.blog_posts
  for select to anon, authenticated
  using (is_published = true and (published_at is null or published_at <= now()));
create policy "blog_admin_all" on public.blog_posts
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "quotations_public_insert" on public.quotations
  for insert to anon, authenticated
  with check (
    length(trim(customer_name)) between 1 and 255
    and length(trim(phone)) between 1 and 80
    and length(trim(event_location)) between 1 and 255
    and length(coalesce(email, '')) <= 320
    and length(coalesce(additional_information, '')) <= 4000
    and status = 'new'
    and is_read = false
    and internal_notes is null
    and ip_address is null
    and user_agent is null
  );
create policy "quotations_admin_read" on public.quotations
  for select to authenticated
  using ((select private.is_admin()));
create policy "quotations_admin_update" on public.quotations
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "quotations_admin_delete" on public.quotations
  for delete to authenticated
  using ((select private.is_admin()));

create policy "translation_cache_admin_all" on public.translation_cache
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "site_settings_admin_all" on public.site_settings
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('services', 'services', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('projects', 'projects', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('blog', 'blog', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('cms-media', 'cms-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "cms_storage_admin_read" on storage.objects
  for select to authenticated
  using ((select private.is_admin()) and bucket_id in ('services', 'projects', 'blog', 'cms-media'));
create policy "cms_storage_admin_insert" on storage.objects
  for insert to authenticated
  with check ((select private.is_admin()) and bucket_id in ('services', 'projects', 'blog', 'cms-media'));
create policy "cms_storage_admin_update" on storage.objects
  for update to authenticated
  using ((select private.is_admin()) and bucket_id in ('services', 'projects', 'blog', 'cms-media'))
  with check ((select private.is_admin()) and bucket_id in ('services', 'projects', 'blog', 'cms-media'));
create policy "cms_storage_admin_delete" on storage.objects
  for delete to authenticated
  using ((select private.is_admin()) and bucket_id in ('services', 'projects', 'blog', 'cms-media'));

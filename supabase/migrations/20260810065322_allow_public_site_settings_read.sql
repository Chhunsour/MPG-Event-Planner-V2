grant select on table public.site_settings to anon, authenticated;

create policy "site_settings_public_read"
on public.site_settings
for select
to anon, authenticated
using (key = any (array[
  'company_email',
  'phone',
  'telegram',
  'instagram',
  'facebook'
]::text[]));

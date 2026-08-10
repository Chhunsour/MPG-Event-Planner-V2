function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error('Missing required environment variable: ' + name);
  return value;
}

export function supabaseEnv() {
  return {
    url: required('NEXT_PUBLIC_SUPABASE_URL'),
    key: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mpgeventplanner.com';
}


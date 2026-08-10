import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { translateWithGoogle } from '@/lib/translation';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { source?: string; target?: 'km' | 'zh'; format?: 'text' | 'html' };
    const source = String(body.source ?? '').trim();
    const target = body.target === 'km' || body.target === 'zh' ? body.target : 'km';
    const format = body.format === 'html' ? 'html' : 'text';

    if (!source) {
      return NextResponse.json({ value: '' });
    }

    const supabase = await createClient();
    const cacheKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode([source, target, format].join('\n'))).then((bytes) => Buffer.from(bytes).toString('hex'));
    const cached = await supabase.from('translation_cache').select('translated_text').eq('cache_key', cacheKey).maybeSingle();

    if (cached.data?.translated_text) {
      return NextResponse.json({ value: cached.data.translated_text });
    }

    const translated = await translateWithGoogle(source, target, format);
    await supabase.from('translation_cache').upsert({ cache_key: cacheKey, source_text: source, translated_text: translated, target_locale: target, format });

    return NextResponse.json({ value: translated });
  } catch (err) {
    console.error('Translation route error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Translation failed' }, { status: 500 });
  }
}

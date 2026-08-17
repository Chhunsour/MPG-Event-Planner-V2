import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, event_type, path, referrer, browser, os, device_type, locale, metadata } = body;

    if (!session_id || !path) {
      return NextResponse.json({ error: 'Missing required analytics fields' }, { status: 400 });
    }

    // Sanitize string fields
    const cleanSessionId = String(session_id).slice(0, 100);
    const cleanEventType = String(event_type || 'page_view').slice(0, 50);
    const cleanPath = String(path).slice(0, 500);
    const cleanReferrer = referrer ? String(referrer).slice(0, 500) : null;
    const cleanBrowser = browser ? String(browser).slice(0, 50) : null;
    const cleanOs = os ? String(os).slice(0, 50) : null;
    const cleanDeviceType = device_type ? String(device_type).slice(0, 30) : 'desktop';
    const cleanLocale = locale ? String(locale).slice(0, 10) : 'en';

    const supabase = await createClient();

    const { error } = await supabase.from('analytics_events').insert({
      session_id: cleanSessionId,
      event_type: cleanEventType,
      path: cleanPath,
      referrer: cleanReferrer,
      browser: cleanBrowser,
      os: cleanOs,
      device_type: cleanDeviceType,
      locale: cleanLocale,
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : {},
    });

    if (error) {
      // Log silently in dev, avoid crashing public client
      console.error('[Analytics Tracker Error]', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Analytics Route Exception]', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

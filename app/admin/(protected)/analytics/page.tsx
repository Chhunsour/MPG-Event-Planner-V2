import { requireCrewRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AnalyticsDashboardClient } from '@/components/admin/analytics-dashboard-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireCrewRole(['owner', 'admin', 'editor', 'viewer']);
  const supabase = await createClient();

  const { data: rawEvents } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Telemetry"
        title="Website Analytics"
        description="Privacy-friendly traffic telemetry, visitor metrics, and top-performing pages."
        action={
          <Link href="/en" target="_blank" className="btn btn-outline">
            View website ↗
          </Link>
        }
      />
      <AnalyticsDashboardClient initialEvents={rawEvents || []} />
    </div>
  );
}

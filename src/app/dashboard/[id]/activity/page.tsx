import { Suspense } from 'react';
import { ActivityChart } from '~/components/activity/activity-chart';
import { ActivityTable } from '~/components/activity/activity-table';
import { QUERIES } from '~/server/db/queries';

async function ActivityChartSSR({ projectId }: { projectId: string }) {
  const activity = await QUERIES.getAllActivityLogsByProject({ projectId });
  const filteredActivity = activity.filter(
    log => log.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  return <ActivityChart activityLogs={filteredActivity} />;
}

async function ActivityTableSSR({ projectId }: { projectId: string }) {
  const logs = await QUERIES.getActivityLogsByProject({ projectId, offset: 0, limit: 10 });
  return <ActivityTable logs={logs} />;
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="h-full overflow-y-auto p-6">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">Activity</h2>

      <Suspense fallback={<div>Loading chart...</div>}>
        <ActivityChartSSR projectId={id} />
      </Suspense>

      <Suspense fallback={<div>Loading table...</div>}>
        <ActivityTableSSR projectId={id} />
      </Suspense>
    </section>
  );
}

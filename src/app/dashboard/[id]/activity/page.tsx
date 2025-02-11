import { Suspense } from 'react';
import { ActivityChart } from '~/components/activity/activity-chart';
import {
  ActivityChartSkeleton,
  ActivityTableSkeleton,
} from '~/components/activity/activity-skeletons';
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
    <section className="h-full overflow-y-auto">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-sm text-muted-foreground">
          View the activity usage and logs for this project.
        </p>
      </div>
      <Suspense fallback={<ActivityChartSkeleton />}>
        <ActivityChartSSR projectId={id} />
      </Suspense>
      <Suspense fallback={<ActivityTableSkeleton />}>
        <ActivityTableSSR projectId={id} />
      </Suspense>
    </section>
  );
}

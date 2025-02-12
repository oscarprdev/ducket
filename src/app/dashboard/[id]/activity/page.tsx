import { Suspense } from 'react';
import { ActivityChart } from '~/components/activity/activity-chart';
import {
  ActivityChartSkeleton,
  ActivityTableSkeleton,
} from '~/components/activity/activity-skeletons';
import { ActivityTable } from '~/components/activity/activity-table';
import { QUERIES } from '~/server/db/queries';

async function ActivityChartSSR({ projectId }: { projectId: string }) {
  const activity = await QUERIES.activityLogs.getAll({ projectId });
  const filteredActivity = activity.filter(
    log => log.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  return <ActivityChart activityLogs={filteredActivity} />;
}

const ITEMS_PER_PAGE = 8;

async function ActivityTableSSR({ projectId, page }: { projectId: string; page: number }) {
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;
  const [logs, count] = await Promise.all([
    QUERIES.activityLogs.getByProject({ projectId, offset, limit }),
    QUERIES.activityLogs.getCount({ projectId }),
  ]);

  const logsWithFileUrl = await Promise.all(
    logs.map(async log => {
      if (!log.fileName) return { ...log, fileUrl: '-' };

      const [file] = await QUERIES.files.getByName({ projectId, fileName: log.fileName });
      return { ...log, fileUrl: file?.fileUrl ?? '-' };
    })
  );

  return (
    <ActivityTable
      logs={logsWithFileUrl}
      totalItems={count}
      projectId={projectId}
      currentPage={currentPage}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: number }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
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
        <ActivityTableSSR projectId={id} page={page} />
      </Suspense>
    </section>
  );
}

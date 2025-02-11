import { Suspense } from 'react';
import { OverviewActivityLog } from '~/components/overview/overview-activity-logs';
import { OverviewRecentFiles } from '~/components/overview/overview-recent-files';
import {
  OverviewActivityLogSkeleton,
  OverviewRecentFilesSkeleton,
  OverviewStorageBarSkeleton,
  OverviewUsageChartSkeleton,
} from '~/components/overview/overview-skeletons';
import { OverviewStorageBar } from '~/components/overview/overview-storage-bar';
import { OverviewUsageChart } from '~/components/overview/overview-usage-chart';
import { QUERIES } from '~/server/db/queries';
import { type Files } from '~/server/db/schema';

async function ActivityLogsSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.getActivityLogsByProject({ projectId, offset: 0, limit: 7 });

  return <OverviewActivityLog activityLogs={activityLogs} />;
}

async function RecentFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.getFilesByProjectId({ projectId, offset: 0, limit: 10 });

  return <OverviewRecentFiles files={files} projectId={projectId} />;
}

async function StorageStats({ projectId }: { projectId: string }) {
  const [{ maxSize }, currentFiles, yesterdayFiles, todayFiles] = await Promise.all([
    QUERIES.getStorageByProjectId({ projectId }),
    QUERIES.getFilesByProjectId({ projectId }),
    QUERIES.getYesterdayFilesByProjectId({ projectId }),
    QUERIES.getTodayFilesByProjectId({ projectId }),
  ]);

  const calculateUsage = (files: Files[]) =>
    files.reduce((acc: number, file) => acc + (file.size ?? 0), 0);

  const currentUsage = calculateUsage(currentFiles);
  const yesterdayUsage = calculateUsage(yesterdayFiles);
  const todayUsage = calculateUsage(todayFiles);

  return (
    <OverviewStorageBar
      currentUsage={currentUsage}
      previousUsage={yesterdayUsage}
      todayUsage={todayUsage}
      maxStorage={maxSize}
    />
  );
}

async function UsageChartSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.getLastWeekActivityLogsByProject({ projectId });

  return <OverviewUsageChart activityLogs={activityLogs} />;
}

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="h-[calc(100vh-10rem)]">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>
      <section className="grid h-full grid-cols-4 grid-rows-6 gap-4">
        <Suspense fallback={<OverviewUsageChartSkeleton />}>
          <UsageChartSSR projectId={id} />
        </Suspense>
        <Suspense fallback={<OverviewStorageBarSkeleton />}>
          <StorageStats projectId={id} />
        </Suspense>
        <Suspense fallback={<OverviewActivityLogSkeleton />}>
          <ActivityLogsSSR projectId={id} />
        </Suspense>
        <Suspense fallback={<OverviewRecentFilesSkeleton />}>
          <RecentFilesSSR projectId={id} />
        </Suspense>
      </section>
    </section>
  );
}

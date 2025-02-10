import { Suspense } from 'react';
import { OverviewActivityLog } from '~/components/overview/overview-activity-logs';
import { ActivityLogSkeleton } from '~/components/overview/overview-activity-skeleton';
import { OverviewRecentFiles } from '~/components/overview/overview-recent-files';
import { OverviewRecentFilesSkeleton } from '~/components/overview/overview-recent-files-skeleton';
import { OverviewStorageBar } from '~/components/overview/overview-storage-bar';
import { OverviewStorageBarSkeleton } from '~/components/overview/overview-storage-bar-skeleton';
import { OverviewUsageChart } from '~/components/overview/overview-usage-chart';
import { OverviewUsageChartSkeleton } from '~/components/overview/overview-usage-chart-skeleton';
import { QUERIES } from '~/server/db/queries';
import { type Files } from '~/server/db/schema';

async function ActivityLogsSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.getActivityLogsByProject({ projectId });

  return <OverviewActivityLog activityLogs={activityLogs} />;
}

async function RecentFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.getFilesByProjectId({ projectId, offset: 0, limit: 5 });

  return <OverviewRecentFiles files={files} />;
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
  return <OverviewUsageChart />;
}

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>
      <div className="grid h-[300px] grid-cols-4 gap-4">
        <OverviewUsageChartSkeleton />
        {/* <Suspense fallback={<OverviewUsageChartSkeleton />}>
          <UsageChartSSR projectId={id} />
        </Suspense> */}
        <Suspense fallback={<OverviewStorageBarSkeleton />}>
          <StorageStats projectId={id} />
        </Suspense>
      </div>
      <div className="mt-7 grid h-[300px] grid-cols-4 gap-4">
        <Suspense fallback={<ActivityLogSkeleton />}>
          <ActivityLogsSSR projectId={id} />
        </Suspense>
        <Suspense fallback={<OverviewRecentFilesSkeleton />}>
          <RecentFilesSSR projectId={id} />
        </Suspense>
      </div>
    </>
  );
}

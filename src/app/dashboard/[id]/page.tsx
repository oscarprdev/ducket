import { Suspense } from 'react';
import { OverviewActivityLog } from '~/components/overview/overview-activity-logs';
import { ActivityLogSkeleton } from '~/components/overview/overview-activity-skeleton';
import { OverviewRecentFiles } from '~/components/overview/overview-recent-files';
import { OverviewRecentFilesSkeleton } from '~/components/overview/overview-recent-files-skeleton';
import { OverviewStorageBar } from '~/components/overview/overview-storage-bar';
import { OverviewUsageChart } from '~/components/overview/overview-usage-chart';
import { QUERIES } from '~/server/db/queries';

async function ActivityLogsSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.getActivityLogsByProject({ projectId });

  return <OverviewActivityLog activityLogs={activityLogs} />;
}

async function RecentFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.getFilesByProjectId({ projectId, offset: 0, limit: 5 });

  return <OverviewRecentFiles files={files} />;
}

async function StorageBarSSR({ projectId }: { projectId: string }) {
  const [{ maxSize }, oldFiles, totalFiles, todayFiles] = await Promise.all([
    QUERIES.getStorageByProjectId({ projectId }),
    QUERIES.getLastMonthFilesByProjectId({ projectId }),
    QUERIES.getFilesByProjectId({ projectId }),
    QUERIES.getTodayFilesByProjectId({ projectId }),
  ]);
  const currentUsage = totalFiles.reduce((acc, file) => acc + file.size, 0);
  const previousUsage = oldFiles.reduce((acc, file) => acc + file.size, 0);
  const todayUsage = todayFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <OverviewStorageBar
      currentUsage={currentUsage}
      maxStorage={maxSize}
      previousUsage={previousUsage}
      todayUsage={todayUsage}
    />
  );
}

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>
      <div className="grid h-[300px] grid-cols-4 gap-4">
        <OverviewUsageChart />
        <StorageBarSSR projectId={id} />
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

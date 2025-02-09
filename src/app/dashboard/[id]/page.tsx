import { Suspense } from 'react';
import { OverviewActivityLog } from '~/components/overview/overview-activity-logs';
import { ActivityLogSkeleton } from '~/components/overview/overview-activity-skeleton';
import { OverviewRecentFiles } from '~/components/overview/overview-recent-files';
import { OverviewRecentFilesSkeleton } from '~/components/overview/overview-recent-files-skeleton';
import { OverviewStorageBar } from '~/components/overview/overview-storage-bar';
import { OverviewUsageChart } from '~/components/overview/overview-usage-chart';
import { QUERIES } from '~/server/db/queries';

const storageData = {
  currentUsage: 536870912, // 512MB in bytes
  maxStorage: 1073741824, // 1GB in bytes
  previousUsage: 419430400, // 400MB in bytes
};

async function ActivityLogsSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.getActivityLogsByProject({ projectId });

  return <OverviewActivityLog activityLogs={activityLogs} />;
}

async function RecentFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.getFilesByProjectId({ projectId, offset: 0, limit: 5 });

  return <OverviewRecentFiles files={files} />;
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
        <OverviewStorageBar {...storageData} />
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

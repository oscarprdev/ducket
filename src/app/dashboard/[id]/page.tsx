import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { OverviewActivityLog } from '~/components/dashboard/overview/overview-activity-logs';
import { OverviewRecentFiles } from '~/components/dashboard/overview/overview-recent-files';
import {
  OverviewActivityLogSkeleton,
  OverviewRecentFilesSkeleton,
  OverviewStorageBarSkeleton,
  OverviewUsageChartSkeleton,
} from '~/components/dashboard/overview/overview-skeletons';
import { OverviewStorageBar } from '~/components/dashboard/overview/overview-storage-bar';
import { OverviewUsageChart } from '~/components/dashboard/overview/overview-usage-chart';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';
import { type Files } from '~/server/db/schema';

async function ActivityLogsSSR({ projectId }: { projectId: string }) {
  const activityLogs = await QUERIES.activityLogs.getByProject({
    projectId,
    offset: 0,
    limit: 7,
  });

  return <OverviewActivityLog activityLogs={activityLogs} projectId={projectId} />;
}

async function RecentFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.files.getByProjectId({ projectId, offset: 0, limit: 10 });

  return <OverviewRecentFiles files={files} projectId={projectId} />;
}

async function StorageStats({ projectId }: { projectId: string }) {
  const [{ maxSize }, currentFiles, yesterdayFiles, todayFiles] = await Promise.all([
    QUERIES.storage.getByProjectId({ projectId }),
    QUERIES.files.getByProjectId({ projectId }),
    QUERIES.files.getLastWeek({ projectId }),
    QUERIES.files.getToday({ projectId }),
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
  const activityLogs = await QUERIES.activityLogs.getLastWeek({ projectId });

  return <OverviewUsageChart activityLogs={activityLogs} projectId={projectId} />;
}

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.expires < new Date().toISOString()) redirect('/sign-in');

  const { id } = await params;
  return (
    <section className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>
      <section className="grid h-[calc(100vh-10.5rem)] grid-cols-4 grid-rows-6 gap-4">
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

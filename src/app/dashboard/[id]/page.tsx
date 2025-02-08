import { OverviewActivityLog } from '~/components/overview/overview-activity-logs';
import { OverviewRecentFiles } from '~/components/overview/overview-recent-files';
import { OverviewStorageBar } from '~/components/overview/overview-storage-bar';
import { OverviewUsageChart } from '~/components/overview/overview-usage-chart';

const storageData = {
  currentUsage: 536870912, // 512MB in bytes
  maxStorage: 1073741824, // 1GB in bytes
  previousUsage: 419430400, // 400MB in bytes
};

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
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
        <OverviewActivityLog />
        <OverviewRecentFiles />
      </div>
    </>
  );
}

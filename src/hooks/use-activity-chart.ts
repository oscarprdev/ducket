import { useDateRange } from './use-date-range';
import { useMemo } from 'react';
import { ACTIVITY_ACTIONS } from '~/lib/constants';
import { type ActivityLogs } from '~/server/db/schema';

type DateRangeType = '7d' | '30d';

interface UseActivityChartOptions {
  type: DateRangeType;
  activityLogs: ActivityLogs[];
}

const groupLogsByDay = (files: ActivityLogs[], type: DateRangeType) => {
  return files.reduce(
    (acc, file) => {
      if (!file.timestamp) return acc;
      const fileDate = new Date(file.timestamp);
      // Ensure single digit days/months have leading zeros
      const month = (fileDate.getMonth() + 1).toString().padStart(2, '0');
      const day = fileDate.getDate().toString().padStart(2, '0');
      const year = fileDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;

      const dayName =
        type === '7d' ? fileDate.toLocaleDateString('en-US', { weekday: 'long' }) : formattedDate;

      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push(file.id);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

export function useActivityChart({ type, activityLogs }: UseActivityChartOptions) {
  const dateRange = useDateRange({ type });

  const { groupedUploads, groupedDeletes, groupedDownloads, groupedReads } = useMemo(() => {
    const uploads = activityLogs.filter(log => log.action === ACTIVITY_ACTIONS.upload);
    const deletes = activityLogs.filter(log => log.action === ACTIVITY_ACTIONS.delete);
    const downloads = activityLogs.filter(log => log.action === ACTIVITY_ACTIONS.download);
    const reads = activityLogs.filter(log => log.action === ACTIVITY_ACTIONS.read);

    return {
      groupedUploads: groupLogsByDay(uploads, type),
      groupedDeletes: groupLogsByDay(deletes, type),
      groupedDownloads: groupLogsByDay(downloads, type),
      groupedReads: groupLogsByDay(reads, type),
    };
  }, [activityLogs, type]);

  const chartData = useMemo(() => {
    return dateRange.map(({ display, fullDate }) => {
      let lookupDate: string;

      if (display === 'Today') {
        // Format today's date consistently with our grouping format
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear();
        lookupDate =
          type === '7d'
            ? today.toLocaleDateString('en-US', { weekday: 'long' })
            : `${month}/${day}/${year}`;
      } else {
        lookupDate = display;
      }

      return {
        date: display,
        fullDate,
        upload: groupedUploads[lookupDate]?.length ?? 0,
        delete: groupedDeletes[lookupDate]?.length ?? 0,
        download: groupedDownloads[lookupDate]?.length ?? 0,
        read: groupedReads[lookupDate]?.length ?? 0,
      };
    });
  }, [dateRange, groupedUploads, groupedDeletes, groupedDownloads, groupedReads, type]);

  const totals = useMemo(() => {
    return {
      uploads: Object.values(groupedUploads).reduce((acc, files) => acc + files.length, 0),
      deletes: Object.values(groupedDeletes).reduce((acc, files) => acc + files.length, 0),
      downloads: Object.values(groupedDownloads).reduce((acc, files) => acc + files.length, 0),
      reads: Object.values(groupedReads).reduce((acc, files) => acc + files.length, 0),
    };
  }, [groupedUploads, groupedDeletes, groupedDownloads, groupedReads]);

  return {
    chartData,
    totals,
    dateRange,
  };
}

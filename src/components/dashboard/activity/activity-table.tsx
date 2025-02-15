'use client';

import { useRouter } from 'next/navigation';
import { TablePagination } from '~/components/dashboard/table-pagination';
import { Badge } from '~/components/ui/badge';
import { CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useActivityBadge } from '~/hooks/use-activity-badge';
import { formatDate } from '~/lib/utils';
import { type ActivityLogsWithUser } from '~/server/db/queries';

interface ActivityTableProps {
  logs: ActivityLogsWithUser[];
  projectId: string;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export function ActivityTable({
  logs,
  projectId,
  currentPage,
  totalItems,
  itemsPerPage,
}: ActivityTableProps) {
  const router = useRouter();
  const badgeVariant = useActivityBadge();

  const handlePageChange = (page: number) => {
    router.push(`/dashboard/${projectId}/activity?page=${page}`, { scroll: false });
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Logs</CardTitle>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No activity logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="max-w-[150px] truncate font-light">{log.fileName}</TableCell>
                <TableCell className="font-light">{log.user}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(log.timestamp)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={badgeVariant(log.action)}>{log.action}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalItems > itemsPerPage && (
        <TablePagination
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

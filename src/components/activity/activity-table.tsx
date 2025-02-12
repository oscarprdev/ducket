'use client';

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
import { useBadgeVariant } from '~/hooks/use-badge-variant';
import { formatRelativeTime } from '~/lib/utils';
import { type ActivityLogsWithUser } from '~/server/db/queries';

interface ActivityTableProps {
  logs: ActivityLogsWithUser[];
}

export function ActivityTable({ logs }: ActivityTableProps) {
  const badgeVariant = useBadgeVariant();

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
            <TableHead>URL</TableHead>
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
                <TableCell className="font-light">{log.fileName}</TableCell>
                <TableCell className="font-light">{log.fileName}</TableCell>
                <TableCell className="font-light">{log.user}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRelativeTime(log.timestamp)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={badgeVariant(log.action)}>{log.action}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

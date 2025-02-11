'use client';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { formatDate } from '~/lib/utils';
import { type ActivityLogsWithUser } from '~/server/db/queries';

interface ActivityTableProps {
  logs: ActivityLogsWithUser[];
}

export function ActivityTable({ logs }: ActivityTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.fileName}</TableCell>
                <TableCell>{log.fileName}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={` ${log.action === 'upload' ? 'bg-green-500/10 text-green-500' : ''} ${log.action === 'download' ? 'bg-blue-500/10 text-blue-500' : ''} ${log.action === 'delete' ? 'bg-red-500/10 text-red-500' : ''} border-0`}>
                    {log.action}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

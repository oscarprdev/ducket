import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { TRANSFER_REQUEST_STATES } from '~/lib/constants';
import { formatRelativeTime } from '~/lib/utils';
import { type TransferRequestsWithUsers } from '~/server/db/schema';

interface TransfersTableProps {
  transfers: TransferRequestsWithUsers[];
}

export function TransfersTable({ transfers }: TransfersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Title</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transfers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No transfers found.
            </TableCell>
          </TableRow>
        ) : (
          transfers.map(transfer => (
            <TableRow key={transfer.id}>
              <TableCell className="font-medium">{transfer.project.title}</TableCell>
              <TableCell>{transfer.fromUser.name}</TableCell>
              <TableCell>{transfer.toUser.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    transfer.state === TRANSFER_REQUEST_STATES.pending
                      ? 'tertiary'
                      : transfer.state === TRANSFER_REQUEST_STATES.declined
                        ? 'destructive'
                        : 'default'
                  }
                  className="capitalize">
                  {transfer.state}
                </Badge>
              </TableCell>
              <TableCell>{formatRelativeTime(transfer.createdAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

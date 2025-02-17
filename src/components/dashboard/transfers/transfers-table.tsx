'use client';

import { AcceptTransferDialog } from './accept-transfer-dialog';
import { DeclineTransferDialog } from './decline-transfer-dialog';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
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
          <TableHead className="text-center">Actions</TableHead>
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
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <AcceptTransferDialog transfer={transfer} />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DeclineTransferDialog transfer={transfer} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

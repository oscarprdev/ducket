'use client';

import { AcceptTransferForm } from './accept-transfer-form';
import { type TransferRequestsWithUsers } from '~/server/db/schema';
import { useState } from 'react';
import { acceptTransfer } from '~/app/dashboard/transfers/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface AcceptTransferDialogProps {
  transfer: TransferRequestsWithUsers;
}

export function AcceptTransferDialog({ transfer }: AcceptTransferDialogProps) {
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  return (
    <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size="dropdownItem">
          Accept transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Transfer</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to accept the transfer of project "${transfer.project.title}"?`}
          </DialogDescription>
        </DialogHeader>
        <AcceptTransferForm
          transferId={transfer.id}
          action={acceptTransfer}
          onActionFinished={() => setAcceptDialogOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setAcceptDialogOpen(false)}>
            Cancel
          </Button>
        </AcceptTransferForm>
      </DialogContent>
    </Dialog>
  );
} 
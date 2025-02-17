'use client';

import { DeclineTransferForm } from './decline-transfer-form';
import { useState } from 'react';
import { declineTransfer } from '~/app/dashboard/transfers/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { type TransferRequestsWithUsers } from '~/server/db/schema';

interface DeclineTransferDialogProps {
  transfer: TransferRequestsWithUsers;
}

export function DeclineTransferDialog({ transfer }: DeclineTransferDialogProps) {
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);

  return (
    <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size="dropdownItem">
          Decline transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Transfer</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to decline the transfer of project "${transfer.project.title}"?`}
          </DialogDescription>
        </DialogHeader>
        <DeclineTransferForm
          transferId={transfer.id}
          action={declineTransfer}
          onActionFinished={() => setDeclineDialogOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setDeclineDialogOpen(false)}>
            Cancel
          </Button>
        </DeclineTransferForm>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { DeleteProposalForm } from './delete-proposal-form';
import { deleteProposal } from '~/app/dashboard/(dashboard)/proposals/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface DeleteProposalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  proposalTitle?: string;
}

export function DeleteProposalDialog({
  isOpen,
  onOpenChange,
  proposalId,
  proposalTitle,
}: DeleteProposalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Proposal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this proposal
            {proposalTitle ? `: "${proposalTitle}"` : ''}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DeleteProposalForm
          action={deleteProposal}
          proposalId={proposalId}
          onActionFinished={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

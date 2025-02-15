'use client';

import { DeclineInvitationForm } from './decline-invitation-form';
import { declineInvitation } from '~/app/dashboard/invitations/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface DeclineInvitationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
  email: string;
}

export function DeclineInvitationDialog({
  isOpen,
  onOpenChange,
  projectId,
  projectTitle,
  email,
}: DeclineInvitationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Invitation</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to decline the invitation to join "${projectTitle}"?`}
          </DialogDescription>
        </DialogHeader>
        <DeclineInvitationForm
          projectId={projectId}
          email={email}
          action={declineInvitation}
          onActionFinished={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

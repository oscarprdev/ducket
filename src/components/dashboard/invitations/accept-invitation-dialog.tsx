'use client';

import { AcceptInvitationForm } from './accept-invitation-form';
import { acceptInvitation } from '~/app/dashboard/invitations/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface AcceptInvitationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
  email: string;
}

export function AcceptInvitationDialog({
  isOpen,
  onOpenChange,
  projectId,
  projectTitle,
  email,
}: AcceptInvitationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Invitation</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to accept the invitation to join "${projectTitle}"?`}
          </DialogDescription>
        </DialogHeader>
        <AcceptInvitationForm
          projectId={projectId}
          email={email}
          action={acceptInvitation}
          onActionFinished={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { DeclineInvitationForm } from './decline-invitation-form';
import { type ProjectWithUserAndPermissions } from './invitations-table';
import { useState } from 'react';
import { declineInvitation } from '~/app/dashboard/invitations/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface DeclineInvitationDialogProps {
  project: ProjectWithUserAndPermissions;
}

export function DeclineInvitationDialog({ project }: DeclineInvitationDialogProps) {
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);

  return (
    <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size="dropdownItem">
          Decline invitation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Invitation</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to decline the invitation to join "${project.title}"?`}
          </DialogDescription>
        </DialogHeader>
        <DeclineInvitationForm
          projectId={project.id}
          email={project.invitedUserEmail}
          action={declineInvitation}
          onActionFinished={() => setDeclineDialogOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => {
              setDeclineDialogOpen(false);
            }}>
            Cancel
          </Button>
        </DeclineInvitationForm>
      </DialogContent>
    </Dialog>
  );
}

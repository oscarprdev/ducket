'use client';

import { AcceptInvitationForm } from './accept-invitation-form';
import { type ProjectWithUserAndPermissions } from './invitations-table';
import { useState } from 'react';
import { acceptInvitation } from '~/app/dashboard/invitations/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface AcceptInvitationDialogProps {
  project: ProjectWithUserAndPermissions;
}

export function AcceptInvitationDialog({ project }: AcceptInvitationDialogProps) {
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  return (
    <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size="dropdownItem">
          Accept invitation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Invitation</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to accept the invitation to join "${project.title}"?`}
          </DialogDescription>
        </DialogHeader>
        <AcceptInvitationForm
          projectId={project.id}
          email={project.invitedUserEmail}
          action={acceptInvitation}
          onActionFinished={() => setAcceptDialogOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => {
              setAcceptDialogOpen(false);
            }}>
            Cancel
          </Button>
        </AcceptInvitationForm>
      </DialogContent>
    </Dialog>
  );
}

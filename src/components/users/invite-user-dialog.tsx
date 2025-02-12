'use client';

import InviteUserForm from './invite-user-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { inviteUser } from '~/app/dashboard/[id]/users/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function InviteUserDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>Send invitation to join the project.</DialogDescription>
        </DialogHeader>
        <InviteUserForm
          projectId={projectId}
          action={inviteUser}
          onActionFinished={() => setIsOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </InviteUserForm>
      </DialogContent>
    </Dialog>
  );
}

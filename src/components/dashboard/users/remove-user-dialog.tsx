'use client';

import { RemoveUserForm } from './remove-user-form';
import { type UserData } from './users-table';
import { useState } from 'react';
import { removeUser } from '~/app/dashboard/[id]/users/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface RemoveUserDialogProps {
  user: UserData;
  projectId: string;
}

export function RemoveUserDialog({ user, projectId }: RemoveUserDialogProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size={'dropdownItem'}>
          Remove from project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>Remove {user.name} from the project.</DialogDescription>
        </DialogHeader>
        <RemoveUserForm action={removeUser} userId={user.id} projectId={projectId}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
        </RemoveUserForm>
      </DialogContent>
    </Dialog>
  );
}

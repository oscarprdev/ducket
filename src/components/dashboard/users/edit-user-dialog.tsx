'use client';

import { EditUserForm } from './edit-user-form';
import { type UserData } from './users-table';
import { useState } from 'react';
import { editUserPermissions } from '~/app/dashboard/[id]/users/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface EditUserDialogProps {
  user: UserData;
  projectId: string;
}

export function EditUserDialog({ user, projectId }: EditUserDialogProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdownItem" size={'dropdownItem'}>
          Edit permissions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details.</DialogDescription>
        </DialogHeader>
        <EditUserForm
          action={editUserPermissions}
          email={user.email}
          projectId={projectId}
          permissions={user.permissions}
          onActionFinished={() => setIsEditOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
        </EditUserForm>
      </DialogContent>
    </Dialog>
  );
}

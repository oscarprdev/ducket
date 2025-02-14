'use client';

import { RemoveUserForm } from './remove-user-form';
import { removeUser } from '~/app/dashboard/[id]/users/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  userId: string;
  userName: string;
}

export function DeleteUserDialog({
  isOpen,
  onOpenChange,
  projectId,
  userId,
  userName,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to remove user "${userName}" from current project? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <RemoveUserForm
          action={removeUser}
          onActionFinished={() => onOpenChange(false)}
          projectId={projectId}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { EditUserForm } from './edit-user-form';
import { editUserPermissions } from '~/app/dashboard/[id]/users/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  userId: string;
  permissions: string[];
}

export function EditUserDialog({
  isOpen,
  onOpenChange,
  projectId,
  userId,
  permissions,
}: EditUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details.</DialogDescription>
        </DialogHeader>
        <EditUserForm
          action={editUserPermissions}
          onActionFinished={() => onOpenChange(false)}
          userId={userId}
          projectId={projectId}
          permissions={permissions}
        />
      </DialogContent>
    </Dialog>
  );
}

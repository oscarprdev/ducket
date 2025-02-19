'use client';

import { DeleteAccountForm } from './delete-account-form';
import { deleteAccount } from '~/app/dashboard/(dashboard)/account/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function DeleteAccountDialog({ isOpen, onOpenChange, userId }: DeleteAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete your account? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DeleteAccountForm
          action={deleteAccount}
          onActionFinished={() => onOpenChange(false)}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
}

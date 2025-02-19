'use client';

import { useState } from 'react';
import { type PropsWithChildren } from 'react';
import { PermissionsSelect } from '~/components/dashboard/permissions-select';
import SubmitButton from '~/components/shared/submit-button';
import { DialogFooter } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type Permission } from '~/lib/constants';
import { type ActionState } from '~/server/auth/middleware';

interface InviteUserFormProps {
  projectId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function InviteUserForm({
  children,
  projectId,
  action,
  onActionFinished,
}: PropsWithChildren<InviteUserFormProps>) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'User invitation sent',
        description: 'User has been invited successfully',
        variant: 'success',
      });
      onActionFinished?.();
    },
  });

  const handleAction = (formData: FormData) => {
    selectedPermissions.forEach(permission => {
      formData.append(permission.value, 'on');
    });
    formData.append('projectId', projectId);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Enter user email" required />
        </div>
        <PermissionsSelect
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
        />
      </div>
      <DialogFooter className="w-full">
        <div className="flex w-full flex-col items-start gap-2">
          {state.error && <p className="-mt-5 ml-auto text-xs text-destructive">{state.error}</p>}
          <div className="flex w-full items-center gap-2">
            {children}
            <SubmitButton
              pending={pending}
              disabled={!projectId || selectedPermissions.length === 0 || pending}
              text="Invite User"
            />
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}

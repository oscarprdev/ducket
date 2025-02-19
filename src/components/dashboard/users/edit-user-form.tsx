'use client';

// import { redirect } from 'next/navigation';
import { type PropsWithChildren, useState } from 'react';
import { PermissionsSelect } from '~/components/dashboard/permissions-select';
import SubmitButton from '~/components/shared/submit-button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { API_KEY_PERMISSIONS, type Permission, availablePermissions } from '~/lib/constants';
import type { ActionState } from '~/server/auth/middleware';

interface EditUserFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  projectId: string;
  email: string;
  permissions: string[];
  onActionFinished?: () => void;
}

export function EditUserForm({
  action,
  projectId,
  email,
  permissions,
  children,
  onActionFinished,
}: PropsWithChildren<EditUserFormProps>) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(() => {
    if (permissions.includes(API_KEY_PERMISSIONS.all)) {
      return availablePermissions;
    }
    return availablePermissions.filter(p => permissions.includes(p.value));
  });

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'User permissions updated',
        description: 'User permissions have been updated successfully',
        variant: 'success',
      });
      onActionFinished?.();
      // redirect(`/dashboard/${projectId}/users`);
    },
  });

  const handleAction = (formData: FormData) => {
    selectedPermissions.forEach(permission => {
      formData.append(permission.value, 'on');
    });
    formData.append('projectId', projectId);
    formData.append('email', email);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="w-full space-y-4">
      <PermissionsSelect
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
      <div className="flex w-full flex-col items-start gap-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex w-full items-center justify-end space-x-4">
          {children}
          <SubmitButton pending={pending} disabled={pending} text="Update Project" />
        </div>
      </div>
    </form>
  );
}

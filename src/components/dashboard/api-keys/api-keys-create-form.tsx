'use client';

import { useState } from 'react';
import { type PropsWithChildren } from 'react';
import { PermissionsSelect } from '~/components/dashboard/permissions-select';
import SubmitButton from '~/components/submit-button';
import { DialogFooter } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type Permission } from '~/lib/constants';
import { type ActionState } from '~/server/auth/middleware';

interface ApiKeyCreateFormProps {
  projectId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function ApiKeysCreateForm({
  children,
  projectId,
  action,
  onActionFinished,
}: PropsWithChildren<ApiKeyCreateFormProps>) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'API key created',
        description: 'Your API key has been created successfully',
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
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Enter key name" required />
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
              text="Create API Key"
            />
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}

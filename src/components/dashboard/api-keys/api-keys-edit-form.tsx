'use client';

import { useMemo, useState } from 'react';
import { type PropsWithChildren } from 'react';
import { PermissionsSelect } from '~/components/dashboard/permissions-select';
import SubmitButton from '~/components/submit-button';
import { DialogFooter } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { availablePermissions } from '~/lib/constants';
import { type Permission } from '~/lib/constants';
import { type ActionState } from '~/server/auth/middleware';
import { type ApiKeys } from '~/server/db/schema';

interface ApiKeysEditFormProps {
  apiKey: ApiKeys;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function ApiKeysEditForm({
  children,
  apiKey,
  action,
  onActionFinished,
}: PropsWithChildren<ApiKeysEditFormProps>) {
  const { toast } = useToast();
  const [name, setName] = useState(apiKey.name);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(() =>
    availablePermissions.filter(p => apiKey.permissions.includes(p.value))
  );

  const isModified = useMemo(() => {
    const nameChanged = name !== apiKey.name;
    const permissionsChanged =
      selectedPermissions.length !== apiKey.permissions.length ||
      !selectedPermissions.every(p => apiKey.permissions.includes(p.value));
    return nameChanged || permissionsChanged;
  }, [name, selectedPermissions, apiKey.name, apiKey.permissions]);

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'API key updated',
        description: 'Your API key has been updated successfully',
        variant: 'success',
      });
      onActionFinished?.();
    },
  });

  const handleAction = (formData: FormData) => {
    selectedPermissions.forEach(permission => {
      formData.append(permission.value, 'on');
    });
    formData.append('projectId', apiKey.projectId);
    formData.append('currentName', apiKey.name);
    formData.append('apiKey', apiKey.secret);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={name.split('/')[1]}
            onChange={e => setName(e.target.value)}
            placeholder="Enter key name"
          />
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
              disabled={!isModified || selectedPermissions.length === 0 || pending}
              text="Save changes"
            />
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}

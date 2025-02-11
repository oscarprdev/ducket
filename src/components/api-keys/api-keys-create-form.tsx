'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/submit-button';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { DialogFooter } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface Permission {
  value: string;
  label: string;
  description: string;
}

const availablePermissions: Permission[] = [
  { value: 'read', label: 'Read', description: 'Get files and metadata' },
  { value: 'write', label: 'Write', description: 'Upload files' },
  { value: 'delete', label: 'Delete', description: 'Remove files' },
  { value: 'all', label: 'All', description: 'Full access' },
];

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

  function addPermission(value: string) {
    const permission = availablePermissions.find(p => p.value === value);
    if (permission && !selectedPermissions.some(p => p.value === value)) {
      if (value === 'all') {
        setSelectedPermissions([permission]);
        return;
      }
      const newPermissions = selectedPermissions.filter(p => p.value !== 'all');
      setSelectedPermissions([...newPermissions, permission]);
    }
  }

  function removePermission(value: string) {
    setSelectedPermissions(selectedPermissions.filter(p => p.value !== value));
  }

  const availableToSelect = availablePermissions.filter(
    p =>
      !selectedPermissions.some(sp => sp.value === p.value) &&
      (p.value !== 'all' || selectedPermissions.length === 0)
  );

  return (
    <form action={handleAction} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Enter key name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Enter user's email" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label>Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map(permission => (
                <Badge key={permission.value} className="gap-2 pr-1">
                  {permission.label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-4 rounded-full border border-transparent text-accent hover:bg-accent/90 hover:text-accent-foreground/90"
                    onClick={() => removePermission(permission.value)}>
                    <X className="h-1 w-1" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <Select onValueChange={addPermission} value="" disabled={availableToSelect.length === 0}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue
                placeholder={
                  availableToSelect.length === 0
                    ? 'No more permissions available'
                    : 'Select permissions'
                }
              />
            </SelectTrigger>
            <SelectContent className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
              {availableToSelect.map(permission => (
                <SelectItem
                  key={permission.value}
                  value={permission.value}
                  className="group cursor-pointer">
                  <div className="flex flex-col">
                    <span>{permission.label}</span>
                    <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground">
                      {permission.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

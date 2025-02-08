import SubmitButton from '../submit-button';
import { DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '@radix-ui/react-label';
import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';
import { type ApiKeys } from '~/server/db/schema';

interface ApiKeyEditFormProps {
  apiKey: ApiKeys;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function ApiKeysEditForm({
  children,
  apiKey,
  action,
  onActionFinished,
}: PropsWithChildren<ApiKeyEditFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: (message?: string) => {
      toast({ title: 'API key editted', description: message ?? 'Your API key has been editted' });

      setTimeout(() => {
        onActionFinished?.();
        redirect(`/dashboard/${apiKey.projectId}/api-keys`);
      }, 100);
    },
  });

  const handleAction = (formData: FormData) => {
    formData.append('projectId', apiKey.projectId);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={apiKey.name}
            className="col-span-3"
            placeholder="Enter a name for your API key"
          />
        </div>
        <div className="grid gap-2">
          <Label>Permissions</Label>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="read" className="flex items-center gap-2">
                <span>Read</span>
                <span className="text-xs text-muted-foreground">(Get files and metadata)</span>
              </Label>
              <Switch id="read" name="read" defaultChecked={apiKey.permissions.includes('read')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="write" className="flex items-center gap-2">
                <span>Write</span>
                <span className="text-xs text-muted-foreground">(Upload files)</span>
              </Label>
              <Switch
                id="write"
                name="write"
                defaultChecked={apiKey.permissions.includes('write')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="delete" className="flex items-center gap-2">
                <span>Delete</span>
                <span className="text-xs text-muted-foreground">(Remove files)</span>
              </Label>
              <Switch
                id="delete"
                name="delete"
                defaultChecked={apiKey.permissions.includes('delete')}
              />
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex items-center gap-2">
          {children}
          <SubmitButton
            pending={pending}
            disabled={!apiKey.projectId || pending}
            text=" Edit API Key"
          />
        </div>
      </DialogFooter>
    </form>
  );
}

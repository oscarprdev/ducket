import LoaderCircle from './icons/loader-circle';
import SubmitButton from './submit-button';
import { Button } from './ui/button';
import { DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from '@radix-ui/react-label';
import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface CreateApiKeyFormProps {
  projectId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function CreateApiKeyForm({
  children,
  projectId,
  action,
  onActionFinished,
}: PropsWithChildren<CreateApiKeyFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({ title: 'Project created', description: 'Your project has been created' });

      setTimeout(() => {
        onActionFinished?.();
        redirect(`/dashboard/${projectId}/api-keys`);
      }, 100);
    },
  });

  const handleAction = (formData: FormData) => {
    formData.append('projectId', projectId);
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
            className="col-span-3"
            placeholder="Enter a name for your API key"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="col-span-3"
            placeholder="Enter user's email"
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
              <Switch id="read" name="read" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="write" className="flex items-center gap-2">
                <span>Write</span>
                <span className="text-xs text-muted-foreground">(Upload files)</span>
              </Label>
              <Switch id="write" name="write" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="delete" className="flex items-center gap-2">
                <span>Delete</span>
                <span className="text-xs text-muted-foreground">(Remove files)</span>
              </Label>
              <Switch id="delete" name="delete" />
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex items-center gap-2">
          {children}
          <SubmitButton pending={pending} disabled={!projectId || pending} text=" Create API Key" />
        </div>
      </DialogFooter>
    </form>
  );
}

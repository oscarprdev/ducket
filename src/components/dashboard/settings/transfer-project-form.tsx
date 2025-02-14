import SubmitButton from '../../submit-button';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface TransferProjectFormProps {
  projectId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function TransferProjectForm({
  action,
  onActionFinished,
  projectId,
}: TransferProjectFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Project transferred successfully',
      });
      onActionFinished?.();
    },
  });

  const handleAction = (formData: FormData) => {
    formData.append('projectId', projectId);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="flex flex-col items-start gap-4">
        <Label htmlFor="email" className="text-right">
          Owner Email
        </Label>
        <Input
          id="email"
          name="email"
          className="col-span-3"
          placeholder="user@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex items-center gap-2">
          <Button type="button" className="w-full" variant={'outline'} onClick={onActionFinished}>
            Cancel
          </Button>
          <SubmitButton pending={pending} disabled={pending} text="Transfer Ownership" />
        </div>
      </div>
    </form>
  );
}

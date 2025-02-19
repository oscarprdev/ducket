'use client';

import SubmitButton from '../shared/submit-button';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import type { ActionState } from '~/server/auth/middleware';

interface DeleteProjectFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  projectId: string;
}

export function DeleteProjectForm({ action, onActionFinished, projectId }: DeleteProjectFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully',
        variant: 'success',
      });
      onActionFinished?.();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('projectId', projectId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Input
          name="projectName"
          className="col-span-3"
          placeholder="Enter the Project Name to confirm deletion"
          required
        />
      </div>
      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            className="w-full focus:border-inherit"
            variant="outline"
            onClick={onActionFinished}>
            Cancel
          </Button>
          <SubmitButton
            pending={pending}
            disabled={pending}
            text="Delete Project"
            variant={{ variant: 'destructive' }}
          />
        </div>
      </div>
    </form>
  );
}

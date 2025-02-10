'use client';

import SubmitButton from '~/components/submit-button';
import { Button } from '~/components/ui/button';
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
    onError: () => {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('projectId', projectId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
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
    </form>
  );
}

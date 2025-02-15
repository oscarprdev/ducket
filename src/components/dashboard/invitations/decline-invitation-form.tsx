'use client';

import SubmitButton from '~/components/submit-button';
import { Button } from '~/components/ui/button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface DeclineInvitationFormProps {
  projectId: string;
  email: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function DeclineInvitationForm({
  projectId,
  email,
  action,
  onActionFinished,
}: DeclineInvitationFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      onActionFinished?.();
      toast({
        title: 'Invitation declined',
        description: 'You have declined the project invitation',
        variant: 'success',
      });
    },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('projectId', projectId);
    formData.append('email', email);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
      <div className="flex items-center gap-2">
        <Button type="button" className="w-full" variant="outline" onClick={onActionFinished}>
          Cancel
        </Button>
        <SubmitButton
          pending={pending}
          disabled={pending}
          text="Decline Invitation"
          variant={{ variant: 'destructive' }}
        />
      </div>
    </form>
  );
}

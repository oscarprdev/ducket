'use client';

import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/submit-button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface AcceptTransferFormProps {
  transferId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function AcceptTransferForm({
  transferId,
  action,
  children,
  onActionFinished,
}: PropsWithChildren<AcceptTransferFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Transfer accepted',
        description: 'You are now the owner of this project',
        variant: 'success',
      });
      onActionFinished?.();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('transferId', transferId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
      <div className="flex items-center gap-2">
        {children}
        <SubmitButton
          pending={pending}
          disabled={pending}
          text="Accept Transfer"
          variant={{ variant: 'default' }}
        />
      </div>
    </form>
  );
} 
'use client';

import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/shared/submit-button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface DeclineTransferFormProps {
  transferId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function DeclineTransferForm({
  transferId,
  action,
  children,
  onActionFinished,
}: PropsWithChildren<DeclineTransferFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Transfer declined',
        description: 'You have declined the transfer request',
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
          text="Decline Transfer"
          variant={{ variant: 'destructive' }}
        />
      </div>
    </form>
  );
}

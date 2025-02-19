'use client';

import SubmitButton from '~/components/shared/submit-button';
import { Button } from '~/components/ui/button';
import { FormErrorMessage } from '~/components/ui/form-error-message';
import { Input } from '~/components/ui/input';
import { useFormAction } from '~/hooks/use-form-action';
import type { ActionState } from '~/server/auth/middleware';

interface DeleteAccountFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  userId: string;
}

export function DeleteAccountForm({ action, onActionFinished, userId }: DeleteAccountFormProps) {
  const { state, formAction, pending } = useFormAction({
    action,
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('userId', userId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4">
        <Input
          name="email"
          type="email"
          className="col-span-3"
          placeholder="Enter your email to confirm deletion"
          required
        />
        <FormErrorMessage>Invalid email pattern</FormErrorMessage>
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
            text="Delete Account"
            variant={{ variant: 'destructive' }}
          />
        </div>
      </div>
    </form>
  );
}

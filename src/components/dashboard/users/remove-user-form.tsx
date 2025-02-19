'use client';

import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/shared/submit-button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import type { ActionState } from '~/server/auth/middleware';

interface RemoveUserFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  projectId: string;
  userId: string;
}

export function RemoveUserForm({
  action,
  projectId,
  userId,
  children,
}: PropsWithChildren<RemoveUserFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'User removed',
        description: 'User has been removed from the project successfully',
        variant: 'success',
      });
      redirect(`/dashboard/${projectId}/users`);
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
    formData.append('userId', userId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        {children}
        <SubmitButton
          pending={pending}
          disabled={pending}
          text="Remove User"
          variant={{ variant: 'destructive' }}
        />
      </div>
    </form>
  );
}

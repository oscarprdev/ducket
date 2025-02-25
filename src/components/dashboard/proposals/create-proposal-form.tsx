'use client';

import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/shared/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface CreateProposalFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function CreateProposalForm({
  action,
  children,
  onActionFinished,
}: PropsWithChildren<CreateProposalFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Proposal created',
        description: 'Your proposal has been submitted successfully',
        variant: 'success',
      });
      onActionFinished?.();
    },
  });

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter a clear and concise title"
          required
          minLength={3}
          maxLength={100}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your proposal in detail"
          required
          minLength={10}
          maxLength={1000}
          className="h-32"
        />
      </div>

      {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
      <div className="flex items-center gap-2">
        {children}
        <SubmitButton pending={pending} disabled={pending} text="Create Proposal" />
      </div>
    </form>
  );
} 
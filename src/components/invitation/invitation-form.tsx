'use client';

import SubmitButton from '../submit-button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { redirect } from 'next/navigation';
import { useFormAction } from '~/hooks/use-form-action';
import { type ActionState } from '~/server/auth/middleware';

interface InvitationFormProps {
  email: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function InvitationForm({ action, email }: InvitationFormProps) {
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      redirect('/dashboard');
    },
  });
  return (
    <form action={formAction} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="jhon@doe.com"
          defaultValue={email}
          disabled={pending}
          required
        />
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Jhon Doe" disabled={pending} required />
      </div>

      <div className="flex items-center justify-end space-x-4">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <SubmitButton pending={pending} disabled={pending} text="Create Project" />
      </div>
    </form>
  );
}

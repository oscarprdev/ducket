'use client';

import SubmitButton from '../shared/submit-button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { type AuthActionState } from './auth-form';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';

interface SendRecoverEmailButtonProps {
  action: (prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>;
}

export function SendRecoverForm({ action }: SendRecoverEmailButtonProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Recover password email sent',
        description: 'Check your email for the link to reset your password',
      });
    },
  });

  return (
    <form action={formAction} className="w-full">
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" placeholder="jhon@doe.com" disabled={pending} required />
      <div className="flex items-center justify-end space-x-4">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <SubmitButton pending={pending} disabled={pending} text={'Send recover email'} />
      </div>
    </form>
  );
}

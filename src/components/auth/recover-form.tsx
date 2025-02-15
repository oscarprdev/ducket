'use client';

import { Button } from '../ui/button';
import { type AuthActionState } from './auth-form';
import { Eye, EyeOff } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import SubmitButton from '~/components/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';

interface RecoverPasswordFormProps {
  token: string;
  action: (prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>;
}

export default function RecoverPasswordForm({ token, action }: RecoverPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      redirect('/sign-in');
    },
    onError: error => {
      if (error?.includes('NEXT_REDIRECT')) {
        redirect('/dashboard');
      } else {
        return { error: error };
      }
    },
  });

  const handleAction = (formData: FormData) => {
    formData.set('token', token);
    formAction(formData);
  };

  return (
    <>
      <form action={handleAction} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="********"
              disabled={pending}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="repeatPassword">Repeat Password</Label>
          <div className="relative">
            <Input
              id="repeatPassword"
              type={showRepeatPassword ? 'text' : 'password'}
              name="repeatPassword"
              placeholder="********"
              disabled={pending}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              aria-label={showRepeatPassword ? 'Hide password' : 'Show password'}>
              {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
          <SubmitButton pending={pending} disabled={pending} text={'Update password'} />
        </div>
      </form>
    </>
  );
}

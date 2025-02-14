'use client';

import SubmitButton from '../submit-button';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useFormAction } from '~/hooks/use-form-action';
import { type ActionState } from '~/server/auth/middleware';

export type AuthMode = 'sign-in' | 'sign-up';
export const AuthModes = {
  signIn: 'sign-in',
  signUp: 'sign-up',
} as const satisfies Record<string, AuthMode>;

interface AuthActionState extends ActionState {
  email?: string;
  password?: string;
}

interface AuthFormProps {
  mode: AuthMode;
  email?: string;
  action: (prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>;
}

export function AuthForm({ mode, action, email }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { state, formAction, pending } = useFormAction({
    action,
    onError: error => {
      if (error?.includes('NEXT_REDIRECT')) {
        redirect('/dashboard');
      }
    },
  });

  return (
    <>
      <form action={formAction} className="w-full space-y-4">
        <div className="space-y-2">
          {mode === AuthModes.signUp && (
            <>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Jhon Doe" disabled={pending} required />
            </>
          )}
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="jhon@doe.com"
            defaultValue={email}
            disabled={pending}
            required
          />
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

        <div className="flex items-center justify-end space-x-4">
          {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
          <SubmitButton
            pending={pending}
            disabled={pending}
            text={mode === AuthModes.signUp ? 'Sign Up' : 'Sign In'}
          />
        </div>
      </form>
    </>
  );
}

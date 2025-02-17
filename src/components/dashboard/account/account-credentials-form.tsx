'use client';

import SubmitButton from '~/components/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface AccountCredentialsFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  userId: string;
  isOAuthUser: boolean;
}

export function AccountCredentialsForm({
  action,
  onActionFinished,
  userId,
  isOAuthUser,
}: AccountCredentialsFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Password updated successfully',
      });
      onActionFinished?.();
    },
  });

  const handleAction = (formData: FormData) => {
    formData.append('userId', userId);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="flex flex-col items-start gap-4">
        <Label htmlFor="currentPassword" className="text-right">
          Current Password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          name="currentPassword"
          className="col-span-3"
          placeholder="********"
          autoComplete="current-password"
          disabled={isOAuthUser}
          required
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <Label htmlFor="newPassword" className="text-right">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          name="newPassword"
          className="col-span-3"
          placeholder="********"
          autoComplete="new-password"
          disabled={isOAuthUser}
          required
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <Label htmlFor="confirmPassword" className="text-right">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="col-span-3"
          placeholder="********"
          autoComplete="new-password"
          disabled={isOAuthUser}
          required
        />
      </div>
      <div className="sr-only flex flex-col items-start gap-4">
        <Label htmlFor="username" className="sr-only">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={userId}
          className="sr-only"
        />
      </div>

      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex w-full items-center gap-2">
          <SubmitButton
            pending={pending}
            disabled={pending || isOAuthUser}
            text="Update Password"
            className="ml-auto"
          />
        </div>
      </div>
    </form>
  );
}

'use client';

import SubmitButton from '~/components/shared/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface ProfileInformationFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  userId: string;
  name: string | null;
  email: string;
  isOAuthUser: boolean;
}

export function ProfileInformationForm({
  action,
  onActionFinished,
  userId,
  name,
  email,
  isOAuthUser,
}: ProfileInformationFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'User information update',
        description: 'Your user information has been updated successfully',
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
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          className="col-span-3"
          placeholder="John Doe"
          defaultValue={name ?? ''}
          disabled={isOAuthUser}
          required
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          className="col-span-3"
          placeholder="user@example.com"
          defaultValue={email}
          disabled={isOAuthUser}
          required
        />
      </div>
      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex w-full items-center gap-2">
          <SubmitButton
            pending={pending}
            disabled={pending || isOAuthUser}
            text="Update Information"
            className="ml-auto"
          />
        </div>
      </div>
    </form>
  );
}

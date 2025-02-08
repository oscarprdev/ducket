'use client';

import SubmitButton from '~/components/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface CreateProjectFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function CreateProjectForm({ action, onActionFinished }: CreateProjectFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({ title: 'Project created', description: 'Your project has been created' });
      onActionFinished?.();
    },
  });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-title">Project Title</Label>
        <Input
          id="project-title"
          name="title"
          placeholder="Enter project title"
          disabled={pending}
          required
        />
      </div>

      <div className="space-y-2">
        {state.error && <p className="text-xs text-destructive">{state.error}</p>}
        <SubmitButton pending={pending} disabled={pending} text="Create Project" />
      </div>
    </form>
  );
}

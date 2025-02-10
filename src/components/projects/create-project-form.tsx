'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import SubmitButton from '~/components/submit-button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import type { ActionState } from '~/server/auth/middleware';

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
    <form action={formAction} className="w-full space-y-4">
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

      <div className="flex items-center justify-end space-x-4">
        <AnimatePresence mode="wait">
          {state.error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 rounded border border-destructive bg-destructive-foreground px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{state.error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <SubmitButton pending={pending} disabled={pending} text="Create Project" />
      </div>
    </form>
  );
}

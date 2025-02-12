'use client';

import { PermissionsSelect } from '../permissions-select';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import SubmitButton from '~/components/submit-button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { API_KEY_PERMISSIONS, type Permission, availablePermissions } from '~/lib/constants';
import type { ActionState } from '~/server/auth/middleware';

interface EditUserFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  projectId: string;
  userId: string;
  permissions: string[];
}

export function EditUserForm({
  action,
  onActionFinished,
  projectId,
  userId,
  permissions,
}: EditUserFormProps) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(() => {
    if (permissions.includes(API_KEY_PERMISSIONS.all)) {
      return availablePermissions;
    }
    return availablePermissions.filter(p => permissions.includes(p.value));
  });

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      onActionFinished?.();
      toast({
        title: 'User permissions updated',
        description: 'User permissions have been updated successfully',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    },
  });

  const handleAction = (formData: FormData) => {
    selectedPermissions.forEach(permission => {
      formData.append(permission.value, 'on');
    });
    formData.append('projectId', projectId);
    formData.append('userId', userId);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="w-full space-y-4">
      <PermissionsSelect
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
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
        <SubmitButton pending={pending} disabled={pending} text="Update Project" />
      </div>
    </form>
  );
}

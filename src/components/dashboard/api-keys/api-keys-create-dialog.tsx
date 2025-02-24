'use client';

import ApiKeysCreateForm from './api-keys-create-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createApiKey } from '~/app/dashboard/[id]/api-keys/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function ApiKeysCreateDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>Create a new API key with specific permissions.</DialogDescription>
        </DialogHeader>
        <ApiKeysCreateForm
          projectId={projectId}
          action={createApiKey}
          onActionFinished={() => setIsOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </ApiKeysCreateForm>
      </DialogContent>
    </Dialog>
  );
}

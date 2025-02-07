'use client';

import CreateApiKeyForm from './create-api-key-form';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createApiKey } from '~/app/dashboard/[id]/api-keys/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function CreateApiKeyDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>Create a new API key with specific permissions.</DialogDescription>
        </DialogHeader>
        <CreateApiKeyForm
          projectId={projectId}
          action={createApiKey}
          onActionFinished={handleCloseDialog}>
          <Button type="button" className="w-full" variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </CreateApiKeyForm>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function AddUserDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>Send invitation to join the project.</DialogDescription>
        </DialogHeader>
        {/* <ApiKeysCreateForm
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
        </ApiKeysCreateForm> */}
      </DialogContent>
    </Dialog>
  );
}

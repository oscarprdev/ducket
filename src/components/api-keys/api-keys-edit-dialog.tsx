'use client';

import { Button } from '../ui/button';
import ApiKeysEditForm from './api-keys-edit-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { editApiKey } from '~/app/dashboard/[id]/api-keys/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { type ApiKeys } from '~/server/db/schema';

export function ApiKeysEditDialog({ apiKey }: { apiKey: ApiKeys }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Edit API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
          <DialogDescription>Edit a new API key with specific permissions.</DialogDescription>
        </DialogHeader>
        <ApiKeysEditForm apiKey={apiKey} action={editApiKey} onActionFinished={handleCloseDialog}>
          <Button type="button" className="w-full" variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </ApiKeysEditForm>
      </DialogContent>
    </Dialog>
  );
}

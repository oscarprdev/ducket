'use client';

import ApiKeysEditForm from './api-keys-edit-form';
import { useState } from 'react';
import { editApiKey } from '~/app/dashboard/[id]/api-keys/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { type ApiKeys } from '~/server/db/schema';

interface ApiKeysEditDialogProps {
  apiKey: ApiKeys;
  children: React.ReactNode;
}

export function ApiKeysEditDialog({ apiKey, children }: ApiKeysEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
          <DialogDescription>Modify the API key permissions and settings.</DialogDescription>
        </DialogHeader>
        <ApiKeysEditForm
          apiKey={apiKey}
          action={editApiKey}
          onActionFinished={() => setIsOpen(false)}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </ApiKeysEditForm>
      </DialogContent>
    </Dialog>
  );
}

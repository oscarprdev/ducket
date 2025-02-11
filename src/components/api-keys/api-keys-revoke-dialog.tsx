'use client';

import ApiKeysRevokeForm from './api-keys-revoke-form';
import { useState } from 'react';
import { revokeApiKeys } from '~/app/dashboard/[id]/api-keys/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface ApiKeysRevokeDialogProps {
  selectedKeys: string[];
  projectId: string;
  cleanSelectedKeys: (keys: string[]) => void;
}

export default function ApiKeysRevokeDialog({
  selectedKeys,
  projectId,
  cleanSelectedKeys,
}: ApiKeysRevokeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Revoke keys
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke API Keys</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke these API keys? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <ApiKeysRevokeForm
          selectedKeys={selectedKeys}
          projectId={projectId}
          action={revokeApiKeys}
          onActionFinished={() => cleanSelectedKeys([])}
          onFilesChange={cleanSelectedKeys}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => cleanSelectedKeys([])}>
            Cancel
          </Button>
        </ApiKeysRevokeForm>
      </DialogContent>
    </Dialog>
  );
}

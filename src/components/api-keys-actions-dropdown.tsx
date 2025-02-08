import { ApiKeyDeleteForm } from './api-key-delete-form';
import { ApiKeysEditDialog } from './api-keys-edit-dialog';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { deleteApiKey } from '~/app/dashboard/[id]/api-keys/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { type ApiKeys } from '~/server/db/schema';

export default function ApiKeysActionsDropdown({ apiKey }: { apiKey: ApiKeys }) {
  const [open, setOpen] = useState(false);

  const handleCloseDropdown = () => setOpen(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => copyToClipboard(apiKey.secret)}>
          Copy API Key
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ApiKeysEditDialog apiKey={apiKey} />
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" asChild>
          <ApiKeyDeleteForm
            action={deleteApiKey}
            projectId={apiKey.projectId}
            apiKey={apiKey.secret}
            onActionFinished={handleCloseDropdown}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { TransferProjectForm } from './transfer-project-form';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { transferProject } from '~/app/dashboard/[id]/settings/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function TransferProjectDialog({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Transfer Project
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Project</DialogTitle>
          <DialogDescription>Transfer ownership of this project to another user</DialogDescription>
        </DialogHeader>
        <TransferProjectForm
          projectId={projectId}
          action={transferProject}
          onActionFinished={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

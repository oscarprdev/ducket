'use client';

import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { createProject } from '~/app/dashboard/actions';
import { CreateProjectForm } from '~/components/dashboard/projects/create-project-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function CreateProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Enter the details for your new project.</DialogDescription>
        </DialogHeader>
        <CreateProjectForm action={createProject} onActionFinished={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

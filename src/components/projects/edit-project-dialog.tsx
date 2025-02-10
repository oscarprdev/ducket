'use client';

import { useState } from 'react';
import { editProject } from '~/app/dashboard/actions';
import { EditProjectForm } from '~/components/projects/edit-project-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface EditProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export function EditProjectDialog({ isOpen, onOpenChange, projectId, projectTitle }: EditProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details.</DialogDescription>
        </DialogHeader>
        <EditProjectForm 
          action={editProject} 
          onActionFinished={() => onOpenChange(false)}
          defaultTitle={projectTitle}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
} 
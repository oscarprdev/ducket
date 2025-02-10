'use client';

import { DeleteProjectForm } from './delete-project-form';
import { deleteProject } from '~/app/dashboard/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export function DeleteProjectDialog({
  isOpen,
  onOpenChange,
  projectId,
  projectTitle,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete project "${projectTitle}"? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DeleteProjectForm
          action={deleteProject}
          onActionFinished={() => onOpenChange(false)}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
}

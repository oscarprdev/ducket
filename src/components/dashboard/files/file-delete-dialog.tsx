'use client';

import FileDeleteForm from './file-delete-form';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteFile } from '~/app/dashboard/[id]/files/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface FileDeleteDialogProps {
  projectId: string;
  userId: string;
  selectedFiles: string[];
  cleanSelectedFiles: (files: string[]) => void;
}

export default function FileDeleteDialog({
  projectId,
  userId,
  selectedFiles,
  cleanSelectedFiles,
}: FileDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete files</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the following files?
          </DialogDescription>
        </DialogHeader>
        <FileDeleteForm
          projectId={projectId}
          userId={userId}
          selectedFiles={selectedFiles}
          action={deleteFile}
          onActionFinished={() => cleanSelectedFiles([])}
          onFilesChange={cleanSelectedFiles}>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => cleanSelectedFiles([])}>
            Cancel
          </Button>
        </FileDeleteForm>
      </DialogContent>
    </Dialog>
  );
}

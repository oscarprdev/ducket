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
  apiKey: string;
  selectedFiles: string[];
  cleanSelectedFiles: () => void;
}

export default function FileDeleteDialog({
  apiKey,
  selectedFiles,
  cleanSelectedFiles,
}: FileDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsOpen(false);
    cleanSelectedFiles();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive-foreground hover:text-destructive">
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
        <div className="p-4 text-center">
          {selectedFiles.map(fileName => (
            <p key={fileName} className="text-sm font-semibold text-destructive">
              {fileName}
            </p>
          ))}
        </div>
        <FileDeleteForm
          selectedFiles={selectedFiles}
          apiKey={apiKey}
          action={deleteFile}
          onActionFinished={handleCloseDialog}>
          <Button type="button" className="w-full" variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </FileDeleteForm>
      </DialogContent>
    </Dialog>
  );
}

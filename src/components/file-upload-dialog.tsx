'use client';

import { FileUploadForm } from './file-upload-form';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { uploadFile } from '~/app/dashboard/[id]/files/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function FileUploadDialog({ apiKey, projectId }: { apiKey: string; projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Select a file to upload to your project.</DialogDescription>
        </DialogHeader>
        <FileUploadForm
          projectId={projectId}
          apiKey={apiKey}
          action={uploadFile}
          onActionFinished={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

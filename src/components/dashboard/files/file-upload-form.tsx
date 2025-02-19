'use client';

import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SubmitButton from '~/components/shared/submit-button';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { formatFileSize } from '~/lib/utils';
import { type ActionState } from '~/server/auth/middleware';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadFormProps {
  projectId: string;
  userId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function FileUploadForm({
  projectId,
  userId,
  action,
  onActionFinished,
}: FileUploadFormProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({ title: 'Files uploaded', description: 'Your files have been uploaded successfully' });
      onActionFinished?.();
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast({
          title: 'Files too large',
          description: `${oversizedFiles.length} file(s) exceed 5MB limit`,
          variant: 'destructive',
        });
        const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        setFiles(prev => [...prev, ...validFiles]);
        return;
      }
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const handleSubmit = async () => {
    console.log(files);
    await Promise.all(
      files.map(async file => {
        const formData = new FormData();
        formData.append('type', file.type ?? '-');
        formData.append('name', file.name ?? '-');
        formData.append('projectId', projectId);
        formData.append('userId', userId);
        formData.append('file', file);
        formAction(formData);
      })
    );
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">File Upload</Label>
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-lg border-[1px] border-dashed border-muted-foreground p-6 text-center">
          <input {...getInputProps()} id="file-upload" name="file" />
          {isDragActive ? (
            <p className="text-primary">Drop the files here ...</p>
          ) : (
            <p className="text-primary">Drag & drop files here, or click to select files</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Maximum file size: 5MB per file</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center space-x-2">
              <p className="text-sm">Selected Files</p>
              <p className="text-xs text-muted-foreground">({files.length})</p>
            </Label>
            {files.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setFiles([])}>
                Clear all
              </Button>
            )}
          </div>

          <div className="scrollable grid max-h-[200px] w-full gap-0.5 space-y-0.5 px-0">
            {files.map((file, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-md border border-border bg-muted px-2 py-1.5 text-sm text-foreground transition-colors">
                <div className="flex flex-col items-start gap-2">
                  <div className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => removeFile(i)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex items-center gap-2">
          <Button type="button" className="w-full" variant={'outline'} onClick={onActionFinished}>
            Cancel
          </Button>
          <SubmitButton
            pending={pending}
            disabled={files.length === 0 || pending}
            text={`Upload File${files.length !== 1 ? 's' : ''}`}
          />
        </div>
      </div>
    </form>
  );
}

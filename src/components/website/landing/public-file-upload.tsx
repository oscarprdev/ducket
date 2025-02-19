'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SubmitButton from '~/components/shared/submit-button';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { toast } from '~/hooks/use-toast';
import { formatFileSize } from '~/lib/utils';
import { type ActionState } from '~/server/auth/middleware';
import { type PublicFiles } from '~/server/db/schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 3; // Maximum number of files

interface PublicFileUploadProps {
  lastPublicFile?: PublicFiles;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function PublicFileUpload({ action, lastPublicFile }: PublicFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const secondsToBeAvailable = lastPublicFile
    ? Math.max(
        0,
        10 -
          Math.floor(
            (Date.now() - new Date(lastPublicFile.createdAt ?? new Date()).getTime()) / 1000
          )
      )
    : 0;
  const [countdown, setCountdown] = useState(secondsToBeAvailable);

  useEffect(() => {
    setCountdown(secondsToBeAvailable);

    if (secondsToBeAvailable <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsToBeAvailable]);

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      setFiles([]);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast({
          title: 'File limit exceeded',
          description: `You can only upload a maximum of ${MAX_FILES} files.`,
          variant: 'destructive',
        });
        return;
      }

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
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const handleSubmit = async () => {
    if (countdown > 0) return;
    await Promise.all(
      files.map(async file => {
        const formData = new FormData();
        formData.append('type', file.type ?? '-');
        formData.append('name', file.name ?? '-');
        formData.append('file', file);
        formAction(formData);
      })
    );
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getButtonText = () => {
    if (countdown > 0) {
      return `Wait ${countdown}s to upload`;
    }
    return `Upload File${files.length !== 1 ? 's' : ''}`;
  };

  return (
    <form action={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-lg border-[1px] border-dashed border-muted-foreground p-6 text-center">
          <input {...getInputProps()} id="file-upload" name="file" />
          {isDragActive ? (
            <p className="text-sm text-primary">Drop the files here ...</p>
          ) : (
            <>
              <p className="hidden text-sm text-primary md:block">
                Drag & drop files here, or click to select files
              </p>
              <p className="block text-sm text-primary md:hidden">Click to select files</p>
            </>
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

      <div className="w-full space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex w-full items-center gap-2">
          <SubmitButton
            className="w-full"
            pending={pending}
            disabled={files.length === 0 || pending || countdown > 0}
            text={getButtonText()}
          />
        </div>
      </div>
    </form>
  );
}

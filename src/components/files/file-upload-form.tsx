'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SubmitButton from '~/components/submit-button';
import { Label } from '~/components/ui/label';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadFormProps {
  projectId: string;
  apiKey: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function FileUploadForm({
  projectId,
  apiKey,
  action,
  onActionFinished,
}: FileUploadFormProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({ title: 'Project created', description: 'Your project has been created' });
      onActionFinished?.();
    },
    onError: () => {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;
      if (selectedFile.size > 5 * 1024 * 1024) {
        return toast({
          title: 'File too large',
          description: 'File size exceeds 5MB limit',
          variant: 'destructive',
        });
      }
      setFile(selectedFile);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('apiKey', apiKey);
    formData.append('type', file?.type ?? '-');
    formData.append('name', file?.name ?? '-');
    formData.append('projectId', projectId);
    formAction(formData);
    setFile(null);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">File Upload</Label>
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <input {...getInputProps()} id="file-upload" name="file" />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag & drop a file here, or click to select a file</p>
          )}
          <p className="mt-2 text-sm text-gray-500">Maximum file size: 5MB</p>
        </div>
      </div>

      {file && (
        <div className="mt-4">
          {preview ? (
            <Image
              src={preview || '/placeholder.svg'}
              alt="File preview"
              width={200}
              height={200}
              className="mx-auto"
            />
          ) : (
            <p>{file.name}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {state.error && <p className="text-xs text-destructive">{state.error}</p>}
        <SubmitButton pending={pending} disabled={!file || pending} text="Upload File" />
      </div>
    </form>
  );
}

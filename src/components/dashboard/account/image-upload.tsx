'use client';

import { Upload, X } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import SubmitButton from '~/components/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { VALID_FILE_TYPES } from '~/lib/constants';
import { type ActionState } from '~/server/auth/middleware';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  initialImage: string | null;
  disabled?: boolean;
  userId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function ImageUpload({ initialImage, disabled = false, userId, action }: ImageUploadProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Image updated',
        description: 'Your profile image has been updated',
      });
    },
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
      });
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (formData: FormData) => {
    const file = formData.get('image') as File;
    const newFormData = new FormData();
    newFormData.append('type', file.type ?? '-');
    newFormData.append('name', file.name ?? '-');
    newFormData.append('userId', userId);
    newFormData.append('file', file);
    formAction(newFormData);
  };

  return (
    <form action={handleSubmit} className="flex h-full w-full gap-4 space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewImage ?? initialImage ?? undefined} alt="Profile" />
          <AvatarFallback>
            {initialImage ? 'User' : <Upload className="h-8 w-8 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
        {previewImage && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-1 top-0 h-6 w-6 rounded-full"
            onClick={handleClearPreview}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          name="image"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept={VALID_FILE_TYPES.images.join(',')}
          className="hidden"
          disabled={disabled}
        />
        <Button type="button" onClick={handleUploadClick} variant="outline" disabled={disabled}>
          {previewImage ? 'Change Image' : 'Upload Image'}
        </Button>
      </div>
      {previewImage && (
        <div className="ml-auto flex flex-col items-end justify-end gap-2">
          {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
          <div>
            <SubmitButton
              pending={pending}
              disabled={pending}
              className="ml-auto mt-auto align-top"
              text="Update image"
            />
          </div>
        </div>
      )}
    </form>
  );
}

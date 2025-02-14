'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useToast } from '~/hooks/use-toast';

export function PublicFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    // Here you would typically send the file to your API
    console.log('Uploading file:', file.name);

    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsUploading(false);
    setFile(null);
    toast({
      title: 'File uploaded successfully',
      description: 'Your file is now publicly available.',
    });
  };

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Choose a file to upload</Label>
        <Input id="file-upload" type="file" onChange={handleFileChange} disabled={isUploading} />
      </div>
      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
        {isUploading ? (
          'Uploading...'
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </>
        )}
      </Button>
    </form>
  );
}

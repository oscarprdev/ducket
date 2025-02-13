'use client';

import LoaderCircle from '../icons/loader-circle';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { downloadFile } from '~/app/dashboard/[id]/files/actions';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface FileDownloadButtonProps {
  fileUrl: string;
  projectId: string;
  fileName: string;
}

export default function FileDownloadButton({
  fileUrl,
  projectId,
  fileName,
}: FileDownloadButtonProps) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setPending(true);
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('selectedFile', fileName);

      const prevState: ActionState = {
        error: undefined,
        success: undefined,
      };

      const actionResponse = await downloadFile(prevState, formData);

      if (actionResponse.error) {
        setPending(false);
        return toast({
          title: 'Download Failed',
          description: actionResponse.error,
          variant: 'destructive',
        });
      }

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Successful',
        description: actionResponse.success,
      });
      setPending(false);
    } catch (error: unknown) {
      setPending(false);
      toast({
        title: 'Download Failed',
        description:
          error instanceof Error ? error.message : 'There was an error downloading your file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" onClick={handleDownload}>
            {pending ? (
              <span className="animate-spin">
                <LoaderCircle />
              </span>
            ) : (
              <Download className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download file</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

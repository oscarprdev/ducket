'use client';

import { Download } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/hooks/use-toast';

interface FileDownloadButtonProps {
  fileUrl: string;
}

export default function FileDownloadButton({ fileUrl }: FileDownloadButtonProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop() ?? 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: 'Your file download has started.',
      });
    } catch (error: unknown) {
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
            <Download className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download file</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

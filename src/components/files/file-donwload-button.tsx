import { Button } from './ui/button';
import { Download, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '~/hooks/use-toast';

export default function FileDownloadButton({ fileUrl }: { fileUrl: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return toast({
        title: 'Error',
        description: 'Error downloading file',
        variant: 'destructive',
      });
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileUrl.split('/').pop() ?? 'download';
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setLoading(false), 500);
  };
  return (
    <Button variant="ghost" disabled={loading} size="icon" onClick={handleDownload}>
      {loading ? (
        <span className="animate-spin">
          <LoaderCircle />
        </span>
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}

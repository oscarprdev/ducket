import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/hooks/use-toast';

export function CopyUrlButton({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: 'URL Copied',
      description: 'The URL has been copied to your clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" onClick={copyUrl}>
            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy URL</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

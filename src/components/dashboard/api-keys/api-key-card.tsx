'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { type ApiKeys } from '~/server/db/schema';

export default function ApiKeyCard({ apiKey }: { apiKey: ApiKeys }) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey.secret);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Copy</CardTitle>
        <CardDescription>Copy your environment variable to your clipboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-black p-2 font-mono text-sm text-white">
          <div className="flex items-center justify-start gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleCopyApiKey} size="icon" variant="ghost">
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Copy API key</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-mono text-sm">
              DUCKET_API_KEY=&apos;{apiKey.secret.slice(0, 5)}...{apiKey.secret.slice(-5)}&apos;
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
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
        <div className="rounded-lg bg-black p-4 font-mono text-sm text-white">
          <div className="flex items-center justify-between">
            <span>
              DUCKET_API_KEY=&apos;{apiKey.secret.slice(0, 5)}...
              {apiKey.secret.slice(-5)}&apos;
            </span>
            <Button
              onClick={handleCopyApiKey}
              size="sm"
              className="text-white duration-300 hover:border hover:border-white/80 hover:text-white/80">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

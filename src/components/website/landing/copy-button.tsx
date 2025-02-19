'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '~/lib/utils';

export function HomeCopyButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText('npm i ducket');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="relative flex w-full items-center gap-2 rounded-sm p-2 text-left font-mono text-xs text-muted-foreground outline-none transition-colors hover:bg-muted/50">
      npm i ducket
      <Copy className="ml-auto h-3 w-3" />
      <div
        className={cn(
          'absolute bottom-full left-1/2 mb-2 w-fit -translate-x-1/2 transform rounded border border-border bg-muted px-5 py-1 text-xs text-primary-foreground text-white shadow-lg transition-all duration-200',
          showTooltip ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        )}>
        Copied to clipboard
      </div>
    </button>
  );
}

import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

interface ApiKeyDocsAsideProps {
  onClose: () => void;
}

export function ApiKeyDocsAside({ onClose }: ApiKeyDocsAsideProps) {
  const [copied, setCopied] = useState(false);
  const [copiedUploadingFile, setCopiedUploadingFile] = useState(false);
  const handleCopyIntitializingBucket = async () => {
    await navigator.clipboard.writeText(`import { Bucket } from '@bucket';
    const bucket = new Bucket({
        useDucket: true,
        apiKey: "your-api-key",
    });`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUploadingFile = async () => {
    await navigator.clipboard.writeText(`export const uploadFile = async (formData: FormData) => {
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string;
        const type = formData.get('type') as string;
    };`);
    setCopiedUploadingFile(true);
    setTimeout(() => setCopiedUploadingFile(false), 2000);
  };

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b py-2">
        <h3 className="text-lg font-semibold">API Documentation</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="space-y-4">
          <section>
            <h4 className="mb-2 font-medium">Creating an API Key</h4>
            <p className="text-sm text-muted-foreground">
              {`To create a new API key, click the "Create key" button. You'll be prompted to name
                your key and select the appropriate permissions.`}
            </p>
          </section>

          <section>
            <h4 className="mb-2 font-medium">Initializing Bucket</h4>

            <div className="mt-3 overflow-hidden rounded-lg border bg-zinc-950">
              <div className="border-b border-zinc-800">
                <div className="flex w-full items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-9 w-9"
                    onClick={handleCopyIntitializingBucket}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-4 p-4">
                <code className="block font-mono text-sm">
                  <span className="text-zinc-500">import</span>
                  <span className="text-white"> {'{ '}</span>
                  <span className="text-white">Bucket</span>
                  <span className="text-white">{' }'}</span>
                  <span className="text-zinc-500"> from </span>
                  <span className="text-emerald-300">{`'@bucket'`}</span>
                  <span className="text-white">;</span>
                </code>
                <code className="block font-mono text-sm">
                  <span className="text-zinc-500">const</span>
                  <span className="text-white"> bucket = </span>
                  <span className="text-zinc-500">new</span>
                  <span className="text-white"> Bucket({'{'}</span>
                  <div className="pl-4">
                    <span className="text-white">useDucket:</span>
                    <span className="text-emerald-300"> true</span>
                    <span className="text-white">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-white">apiKey: </span>
                    <span className="text-emerald-300">gI6ZDBq1GV....fv2t96Xd</span>
                  </div>
                  <span className="text-white">{'})'}</span>
                  <span className="text-white">;</span>
                </code>
              </div>
            </div>
          </section>

          <section>
            <h4 className="mb-2 font-medium">Uploading a File</h4>
            <div className="overflow-hidden rounded-lg border bg-zinc-950">
              <div className="border-b border-zinc-800">
                <div className="flex w-full items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-9 w-9"
                    onClick={handleCopyUploadingFile}>
                    {copiedUploadingFile ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-4 p-4">
                <code className="block font-mono text-sm">
                  <span className="text-zinc-500">export const</span>
                  <span className="text-white"> uploadFile = </span>
                  <span className="text-zinc-500">async</span>
                  <span className="text-white">
                    {' '}
                    (formData: <span className="text-purple-300">FormData</span>) =&gt; {'{'}
                  </span>
                  <div className="pl-4">
                    <span className="text-zinc-500">const</span>
                    <span className="text-white"> file = formData.get(</span>
                    <span className="text-emerald-300">&apos;file&apos;</span>
                    <span className="text-white">) </span>
                    <span className="text-zinc-500">as</span>
                    <span className="text-purple-300"> File</span>
                    <span className="text-white">;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">const</span>
                    <span className="text-white">
                      {' '}
                      fileName = formData.<span>get</span>(
                    </span>
                    <span className="text-emerald-300">&apos;fileName&apos;</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">const</span>
                    <span className="text-white"> type = formData.get(</span>
                    <span className="text-emerald-300">&apos;type&apos;</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="pl-4">
                    <br />
                    <span className="text-zinc-500">const</span>
                    <span className="text-white"> arrayBuffer = </span>
                    <span className="text-zinc-500">await</span>
                    <span className="text-white"> file.arrayBuffer();</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">const</span>
                    <span className="text-white"> buffer = Buffer.from(arrayBuffer);</span>
                  </div>
                  <div className="pl-4">
                    <br />
                    <span className="text-zinc-500">await</span>
                    <span className="text-white">
                      {' '}
                      bucket.<span className="text-orange-300">uploadFile</span>({'{'}
                    </span>
                  </div>
                  <div className="pl-8">
                    <span className="text-white">file: buffer,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-white">type,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-white">name: fileName,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-white">{'}'});</span>
                  </div>
                  <span className="text-white">{'};'}</span>
                </code>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}

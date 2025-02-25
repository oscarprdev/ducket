export function DocsUpload() {
  return (
    <section className="mt-5 w-[90vw] max-w-[700px] space-y-4 text-sm">
      <p className="max-w-[80ch] text-muted-foreground">
        To upload a file to your Ducket storage, use the <code>uploadFile</code> method:
      </p>

      <p className="mt-4 max-w-[80ch] text-muted-foreground">
        The <code>uploadFile</code> method accepts a file buffer, name, and type. It returns a
        success response when the file is successfully uploaded.
      </p>

      <div className="mt-6 rounded-md bg-zinc-950 px-4">
        <div className="border-b border-zinc-800">
          <div className="flex w-full items-start py-2">
            <span className="size-2.5 rounded-full border bg-destructive"></span>
            <span className="size-2.5 rounded-full border bg-tertiary"></span>
            <span className="size-2.5 rounded-full border bg-accent"></span>
          </div>
        </div>
        <div className="space-y-4 py-4">
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">import</span>
            <span className="text-white"> {'{ '}</span>
            <span className="text-white">Bucket</span>
            <span className="text-white">{' }'}</span>
            <span className="text-zinc-500"> from </span>
            <span className="text-accent">{`'@bucket'`}</span>
            <span className="text-white">;</span>
          </code>
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> bucket = </span>
            <span className="text-zinc-500">new</span>
            <span className="text-white"> Bucket({'{'}</span>
            <div className="pl-4">
              <span className="text-white">useDucket:</span>
              <span className="text-accent"> true</span>
              <span className="text-white">,</span>
            </div>
            <div className="pl-4">
              <span className="text-white">apiKey: </span>
              <span className="text-accent">gI6ZDBq1GV....fv2t96Xd</span>
            </div>
            <span className="text-white">{'})'}</span>
            <span className="text-white">;</span>
          </code>
        </div>
        <code className="block font-mono text-xs">
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
            <span className="text-accent">&apos;file&apos;</span>
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
            <span className="text-accent">&apos;fileName&apos;</span>
            <span className="text-white">);</span>
          </div>
          <div className="pl-4">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> type = formData.get(</span>
            <span className="text-accent">&apos;type&apos;</span>
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
            <span className="text-white">name: fileName,</span>
          </div>
          <div className="pl-8">
            <span className="text-white">type,</span>
          </div>
          <div className="pl-4">
            <span className="text-white">{'}'});</span>
          </div>
          <span className="text-white">{'};'}</span>
        </code>
      </div>
    </section>
  );
}

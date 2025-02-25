export function DocsInitialize() {
  return (
    <section className="mt-5 w-[90vw] max-w-[700px] space-y-4 text-sm">
      <p className="max-w-[80ch] text-muted-foreground">
        To start using Ducket you can initialize either using your own Cloudflare R2 credentials or
        using the Ducket platform credentials:
      </p>
      <p className="max-w-[80ch] text-muted-foreground">Using Ducket API credentials:</p>
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
      </div>
      <p className="max-w-[80ch] text-muted-foreground">Using Cloudflare R2 API credentials:</p>
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
            <span className="text-white"> apiUrl = process.env.S3_API_URL;</span>
          </code>
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> accessId = process.env.S3_ACCESS_KEY_ID;</span>
          </code>
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> secret = process.env.S3_SECRET_ACCESS_KEY;</span>
          </code>
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> bucketName = process.env.DUCKET;</span>
          </code>
          <br />
          <code className="block font-mono text-xs">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> bucket = </span>
            <span className="text-zinc-500">new</span>
            <span className="text-white"> Bucket({'{'}</span>
            <div className="pl-4">
              <span className="text-white">apiUrl,</span>
            </div>
            <div className="pl-4">
              <span className="text-white">accessId,</span>
            </div>
            <div className="pl-4">
              <span className="text-white">secret,</span>
            </div>
            <div className="pl-4">
              <span className="text-white">bucketName,</span>
            </div>
            <span className="text-white">{'})'}</span>
            <span className="text-white">;</span>
          </code>
        </div>
      </div>
      <p className="max-w-[80ch] text-muted-foreground">
        Remember when using your own Cloudflare R2 credentials, your files will be stored in your
        own R2 bucket.
      </p>
    </section>
  );
}

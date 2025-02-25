export function DocsGet() {
  return (
    <section className="mt-5 w-[90vw] max-w-[700px] space-y-4 text-sm">
      <p className="max-w-[80ch] text-muted-foreground">
        To retrieve a file from your Ducket storage, use the <code>getFile</code> method:
      </p>
      <p className="mt-4 max-w-[80ch] text-muted-foreground">
        The <code>getFile</code> method returns a file URL that you can use in your application.
      </p>
      <div className="mt-6 rounded-md bg-zinc-950 px-4">
        <div className="border-b border-zinc-800">
          <div className="flex w-full items-start py-2">
            <span className="size-2.5 rounded-full border bg-destructive"></span>
            <span className="size-2.5 rounded-full border bg-tertiary"></span>
            <span className="size-2.5 rounded-full border bg-accent"></span>
          </div>
        </div>

        <code className="block font-mono text-xs">
          <span className="text-zinc-500">export const</span>
          <span className="text-white"> getFile = </span>
          <span className="text-zinc-500">async</span>
          <span className="text-white">
            {' '}
            (formData: <span className="text-purple-300">FormData</span>) =&gt; {'{'}
          </span>
          <div className="pl-4">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> fileName = formData.get(</span>
            <span className="text-accent">&apos;fileName&apos;</span>
            <span className="text-white">) </span>
            <span className="text-zinc-500">as</span>
            <span className="text-purple-300"> string</span>
            <span className="text-white">;</span>
          </div>
          <br />
          <div className="pl-4">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> file = </span>
            <span className="text-zinc-500">await</span>
            <span className="text-white">
              {' '}
              bucket.<span className="text-orange-300">getFile</span>({'{'}
            </span>
          </div>
          <div className="pl-8">
            <span className="text-white">name: fileName</span>
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

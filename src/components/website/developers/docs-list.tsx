export function DocsList() {
  return (
    <section className="mt-5 w-[90vw] max-w-[700px] space-y-4 text-sm">
      <p className="max-w-[80ch] text-muted-foreground">
        To list all files in your Ducket storage, use the <code>listFiles</code> method:
      </p>

      <div className="mt-6 rounded-md bg-zinc-950 p-4">
        <code className="block font-mono text-xs">
          <span className="text-zinc-500">export const</span>
          <span className="text-white"> listFiles = </span>
          <span className="text-zinc-500">async</span>
          <span className="text-white"> () =&gt; {'{'}</span>
          <br />
          <div className="pl-4">
            <span className="text-zinc-500">const</span>
            <span className="text-white"> files = </span>
            <span className="text-zinc-500">await</span>
            <span className="text-white">
              {' '}
              bucket.<span className="text-orange-300">listFiles()</span>;
            </span>
          </div>
          <span className="text-white">{'};'}</span>
        </code>
      </div>

      <p className="mt-4 max-w-[80ch] text-muted-foreground">
        The <code>listFiles</code> method returns an array of file URLs.
      </p>

      <div className="mt-4 rounded-md bg-zinc-950 p-4">
        <code className="block font-mono text-xs">
          <span className="text-zinc-500">{`// Example response`}</span>
          <br />
          <span className="text-white">[</span>
          <div className="pl-4">
            <span className="text-accent">
              &quot;https://ducket.dev/b3147339-...-103f174efcae/image-1.webp&quot;
            </span>
            <span className="text-white">,</span>
            <br />
            <span className="text-accent">
              &quot;https://ducket.dev/b3147339-...-103f174efcae/image-2.webp&quot;
            </span>
            <span className="text-white">,</span>
            <br />
            <span className="text-accent">
              &quot;https://ducket.dev/b3147339-...-103f174efcae/image-3.webp&quot;
            </span>
          </div>
          <span className="text-white">]</span>
        </code>
      </div>
    </section>
  );
}

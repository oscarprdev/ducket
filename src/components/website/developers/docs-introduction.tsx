export function DocsIntroduction() {
  return (
    <section className="mt-5 w-full space-y-4 text-sm">
      <p className="max-w-[80ch] text-muted-foreground">
        - Ducket provides a simple API for you to integrate with your existing projects.
        <br />
        <br />
        - Ducket allows you to not only upload files to the platform, but also to upload files to
        your own bucket. All you need is a Cloudflare R2 bucket and a Cloudflare account.
        <br />
        <br />
        - Ducket files uploaded to the platform will have the same URL pattern:
        <br />
        <br />
        <code className="rounded-md bg-muted-foreground/10 p-2 font-mono text-sm">
          https://ducket.dev/project-id/file-name
        </code>
      </p>
    </section>
  );
}

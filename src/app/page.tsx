export default async function HomePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div className="relative space-y-8">
          {/* <LastUpdatedBadge /> */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              File storage made simple for everyone
            </h1>
            <p className="text-xl text-muted-foreground">
              Simplify your file storage and management with Ducket. Secure, efficient, and easy to
              use. Share files instantly without an account or sign up for more features.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="mb-1 text-sm text-muted-foreground">Businesses</p>
              {/* <AnimatedCounter end={12500} className="text-4xl font-bold" /> */}
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-muted-foreground">Files Shared</p>
              {/* <AnimatedCounter end={15000} className="text-4xl font-bold" /> */}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-md border-[1px] border-dotted border-primary p-2 [border-image:repeating-linear-gradient(to_right,currentColor_0%,currentColor_20%,transparent_20%,transparent_100%)_1] [border-style:dotted]">
            <code className="font-mono text-sm">npm i ducket</code>
            {/* <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
            </Button> */}
          </div>
        </div>

        <div className="space-y-8 rounded-lg border p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Quick Share</h2>
            <p className="text-muted-foreground">
              Upload and share files instantly. No account required.
            </p>
            {/* <PublicFileUpload /> */}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recently Shared Files</h3>
            {/* <PublicFilesList /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

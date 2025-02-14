import { uploadPublicFile } from './actions';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCounter } from '~/components/animated-counter';
import { Header } from '~/components/header';
import { HomeCopyButton } from '~/components/home-copy-button';
import { PublicFileUpload } from '~/components/public-file-upload';
import { PublicFilesList } from '~/components/public-files-list';
import { RotatingText } from '~/components/rotating-text';
import { ShimmerBadge } from '~/components/shimmer-badge';
import { Button } from '~/components/ui/button';
import { QUERIES } from '~/server/db/queries';

async function PublicFilesSection() {
  const publicFiles = await QUERIES.publicFiles.getAll();
  const lastPublicFile = publicFiles[publicFiles.length - 1];
  const secondsToBeAvailable = lastPublicFile
    ? Math.max(
        0,
        10 -
          Math.floor(
            (Date.now() - new Date(lastPublicFile.createdAt ?? new Date()).getTime()) / 1000
          )
      )
    : 0;

  return (
    <div className="space-y-8 rounded-lg border p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Share</h2>
        <p className="text-muted-foreground">
          Share your files with the world in an instant—no account needed! Everyone can access your
          uploads.
        </p>
        <PublicFileUpload action={uploadPublicFile} secondsToBeAvailable={secondsToBeAvailable} />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recently Shared Files</h3>
        <PublicFilesList files={publicFiles} />
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="relative w-full space-y-8">
            <ShimmerBadge className="-mb-5 text-xs">
              <>
                Incoming features
                <ArrowRight className="h-3 w-3" />
              </>
            </ShimmerBadge>

            <div className="space-y-6">
              <h1 className="text-pretty text-3xl tracking-tight text-primary/50">
                Simplify your file storage management with a secure, efficient, and user-friendly
                application made for <RotatingText />
              </h1>
            </div>

            <div className="relative grid grid-cols-4 gap-8">
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Active users</p>
                <AnimatedCounter value={12} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Files</p>
                <AnimatedCounter value={150} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Projects</p>
                <AnimatedCounter value={45} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Downloads</p>
                <AnimatedCounter value={431} className="text-3xl font-bold" />
              </div>
              <div className="absolute bottom-0 left-1/4 top-0 w-px bg-muted-foreground/40"></div>
              <div className="absolute bottom-0 left-1/2 top-0 w-px bg-muted-foreground/40"></div>
              <div className="absolute bottom-0 left-3/4 top-0 w-px bg-muted-foreground/40"></div>
            </div>

            <div className="flex h-12 w-full items-center justify-between gap-2">
              <div className="flex w-full items-center justify-between rounded-md border-[1px] border-dashed border-muted-foreground/80 p-2 transition-colors duration-300 hover:bg-muted-foreground/10">
                <HomeCopyButton />
              </div>
              <Button variant="ghost" className="h-full">
                <Link
                  href="https://www.npmjs.com/package/ducket"
                  target="_blank"
                  className="flex h-full w-full items-center justify-center">
                  <Github className="size-full" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex gap-4">
              <Button asChild className="flex-1">
                <Link href="/sign-in">Start your project</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <Link href="/docs">Read documentation</Link>
              </Button>
            </div>
          </div>

          <PublicFilesSection />
        </div>
      </div>
    </>
  );
}

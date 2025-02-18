import { uploadPublicFile } from './actions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCounter } from '~/components/animated-counter';
import { Header } from '~/components/header';
import { PublicFileUpload } from '~/components/public-file-upload';
import { PublicFilesList } from '~/components/public-files-list';
import { RotatingText } from '~/components/rotating-text';
import { ShimmerBadge } from '~/components/shimmer-badge';
import { Button } from '~/components/ui/button';
import { QUERIES } from '~/server/db/queries';

async function PublicFilesSection() {
  const publicFiles = await QUERIES.publicFiles.getAll();
  const lastPublicFile = publicFiles[publicFiles.length - 1];

  return (
    <div className="space-y-8 rounded-lg border p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Share</h2>
        <PublicFileUpload action={uploadPublicFile} lastPublicFile={lastPublicFile} />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recently shared files</h3>
        <PublicFilesList files={publicFiles} />
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      <Header />
      <div className="mx-auto mt-8 max-w-[1200px] px-4">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="relative w-full space-y-8">
            <ShimmerBadge className="-mb-5 w-fit text-xs">
              <>
                Incoming features
                <ArrowRight className="h-3 w-3" />
              </>
            </ShimmerBadge>

            <div className="space-y-6">
              <h1 className="text-pretty text-5xl font-bold tracking-tight text-primary">
                File storage made simple for <RotatingText />
              </h1>
            </div>
            <div>
              <p className="text-muted-foreground">
                Simplify your file storage and management with Ducket. Secure, efficient, and easy
                to use. Share files instantly without an account or sign up for more features.
              </p>
            </div>

            <div className="relative grid grid-cols-4 gap-8">
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Active users</p>
                <AnimatedCounter value={113} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Files</p>
                <AnimatedCounter value={451} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Projects</p>
                <AnimatedCounter value={57} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Downloads</p>
                <AnimatedCounter value={231} className="text-3xl font-bold" />
              </div>
              <div className="absolute bottom-0 left-1/4 top-0 w-px bg-muted-foreground/40"></div>
              <div className="absolute bottom-0 left-1/2 top-0 w-px bg-muted-foreground/40"></div>
              <div className="absolute bottom-0 left-3/4 top-0 w-px bg-muted-foreground/40"></div>
            </div>

            {/* <div className="flex h-12 w-full items-center justify-between gap-2">
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
            </div> */}

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

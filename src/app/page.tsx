import { ArrowRight } from 'lucide-react';
import { AnimatedCounter } from '~/components/animated-counter';
import { Header } from '~/components/header';
import { HomeCopyButton } from '~/components/home-copy-button';
import { PublicFileUpload } from '~/components/public-file-upload';
import { PublicFilesList } from '~/components/public-files-list';
import { ShimmerBadge } from '~/components/shimmer-badge';

export default async function HomePage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="relative space-y-8">
            <ShimmerBadge>
              <>
                Last Updates
                <ArrowRight className="h-3 w-3" />
              </>
            </ShimmerBadge>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                File storage made simple for everyone
              </h1>
              <p className="text-xl text-muted-foreground">
                Simplify your file storage and management with Ducket. Secure, efficient, and easy
                to use.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Active users</p>
                <AnimatedCounter end={12} className="text-3xl font-bold" />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-muted-foreground">Files</p>
                <AnimatedCounter end={150} className="text-3xl font-bold" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-md border-[1px] border-dashed border-muted-foreground/80 p-2 transition-colors duration-300 hover:bg-muted-foreground/10">
              <HomeCopyButton />
            </div>
          </div>

          <div className="space-y-8 rounded-lg border p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Quick Share</h2>
              <p className="text-muted-foreground">
                Upload and share files instantly. No account required.
              </p>
              <PublicFileUpload />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recently Shared Files</h3>
              <PublicFilesList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

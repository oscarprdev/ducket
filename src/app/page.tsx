import { uploadPublicFile } from './actions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from '~/components/header';
import { HomeFilesCard } from '~/components/home-files-card';
import { HomeUsageCard } from '~/components/home-usage-card';
import { HomeUsersCard } from '~/components/home-users-card';
import { PublicFileUpload } from '~/components/public-file-upload';
import { PublicFilesList } from '~/components/public-files-list';
import { RotatingText } from '~/components/rotating-text';
import { Badge } from '~/components/ui/badge';
import { QUERIES } from '~/server/db/queries';

async function PublicFilesSection() {
  const publicFiles = await QUERIES.publicFiles.getAll();
  const lastPublicFile = publicFiles[publicFiles.length - 1];

  return (
    <div className="mx-auto flex w-full max-w-[800px] items-start justify-between gap-6 rounded-lg border p-6">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold">Quick Share</h2>
        <PublicFileUpload action={uploadPublicFile} lastPublicFile={lastPublicFile} />
      </div>
      <div className="w-full space-y-4">
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
      <section className="relative mx-auto mt-16 max-w-[1200px] bg-background px-4 pt-12">
        <span className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,#474747,rgba(54,54,54,0))]"></span>
        <div className="relative h-screen w-full gap-8">
          <div className="mx-auto flex w-full max-w-[800px] flex-col items-start justify-center gap-1 bg-clip-text pb-5 pt-0 text-center text-transparent">
            <Link href="/roadmap" className="block w-fit cursor-pointer">
              <Badge
                variant="default"
                className={'-mb-2 flex w-fit items-center gap-1 text-xs hover:bg-secondary/80'}>
                <>
                  Check Roadmap
                  <ArrowRight className="h-3 w-3" />
                </>
              </Badge>
            </Link>
            <h1
              style={{
                WebkitTextStroke: '1px white',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
              className="text-[11rem] font-bold leading-none tracking-tighter">
              DUCKET
            </h1>
            <h2 className="w-full text-pretty text-left text-5xl font-bold tracking-tight text-primary">
              Next generation of file storage made simple for <RotatingText />
            </h2>
          </div>

          <PublicFilesSection />
        </div>
      </section>

      <section className="relative mx-auto h-screen max-w-[1200px] space-y-8 bg-background px-4 pt-12">
        <div className="space-y-4">
          <h2 className="text-7xl font-bold">Everything you need</h2>
          <p className="mt-5 text-muted-foreground">
            Ducket is a simple, secure, and easy-to-use file storage solution.
          </p>
        </div>
        <HomeFilesCard />
        <div className="flex items-center gap-4">
          <HomeUsersCard />
          <HomeUsageCard />
        </div>
      </section>

      {/* <div className="relative grid grid-cols-4 gap-8">
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
            </div> */}
    </>
  );
}

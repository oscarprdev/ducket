import { RotatingText } from '../rotating-text';
import { PublicFilesSection } from './public-files-section';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative mx-auto mt-16 grid min-h-screen max-w-[1200px] place-items-center bg-background px-4 pt-12">
      <span className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,#474747,rgba(54,54,54,0))]"></span>
      <div className="relative -mt-20 flex min-h-screen w-full flex-col items-center justify-center gap-8 sm:gap-16">
        <div className="mx-auto flex w-full max-w-[800px] flex-col items-start justify-center gap-1 bg-clip-text text-center text-transparent">
          <div className="flex flex-wrap items-center gap-2 md:-mb-2">
            <Badge variant="outline" className="flex w-fit items-center gap-1 text-xs">
              Open source
            </Badge>
            <Link href="/roadmap" className="block w-fit cursor-pointer">
              <Badge
                variant="default"
                className="flex w-fit items-center gap-1 text-xs hover:bg-accent-foreground/50">
                Roadmap
                <ArrowRight className="size-3" />
              </Badge>
            </Link>
          </div>

          <h1
            style={{
              WebkitTextStroke: '1px white',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}
            className="pointer-events-none text-8xl font-bold leading-none tracking-tighter md:text-8xl lg:text-[11rem]">
            DUCKET
          </h1>
          <h2 className="w-full text-pretty text-left text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
            Next generation of file storage made simple for <RotatingText />
          </h2>
        </div>

        <PublicFilesSection />
      </div>
    </section>
  );
}

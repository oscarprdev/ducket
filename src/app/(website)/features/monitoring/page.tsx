import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { FeatureImage } from '~/components/website/features/files-image';

export default function MonitoringPage() {
  return (
    <>
      <section className="relative mx-auto mt-12 max-w-[1200px] space-y-4 bg-background px-4 py-8 sm:mt-16 sm:space-y-6 sm:py-10 md:mt-20 md:space-y-8 md:py-12">
        <h1 className="pointer-events-none text-4xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Monitoring
        </h1>
        <p className="max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl">
          Everything on your project is monitored and logged. You can see the activity of your
          project in real time.
        </p>
        <Button asChild className="flex-1">
          <Link href="/sign-in">{`Monitor your project now ->`}</Link>
        </Button>
      </section>
      <section className="relative mx-auto max-w-[1200px] space-y-8 bg-background px-4 pb-20">
        <FeatureImage
          src="https://ducket.dev/b3147339-819b-4dac-9362-103f174efcae/overview-screen.webp"
          alt="Files"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-70% to-background to-100%"></div>
      </section>
    </>
  );
}

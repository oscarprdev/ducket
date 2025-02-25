import { DocsTabs } from '~/components/website/developers/docs-tabs';

export default function DevelopersDocsPage() {
  return (
    <section className="relative mx-auto mt-12 max-w-[1200px] space-y-4 bg-background px-4 py-8 sm:mt-16 sm:space-y-6 sm:py-10 md:mt-20 md:space-y-8 md:py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-10">
        <div>
          <h1 className="pointer-events-none text-4xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Docs
          </h1>
          <p className="max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl">
            Check the Ducket API to start working on your project meanwhile we manage your files.
          </p>
        </div>
      </div>
      <DocsTabs />
    </section>
  );
}

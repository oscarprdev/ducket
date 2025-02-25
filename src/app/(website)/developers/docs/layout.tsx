import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="relative mx-auto h-full max-w-[1000px] space-y-8 px-4 pb-28">
        <Card className="space-y-4 py-10">
          <CardHeader>
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Some improvements in mind?
              </h2>
              <p className="mx-auto mt-5 max-w-[70ch] text-sm text-muted-foreground sm:text-base">
                Do you have some suggestion to improve the Ducket API? Try to open a Pull Request on
                the Ducket NPM package or create a community proposal.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/community/proposals">Propose a feature</Link>
              </Button>
              <Button asChild className="flex-1" variant="outline">
                <Link
                  href="https://github.com/oscarprdev/Ducket_npm"
                  target="_blank"
                  rel="noopener noreferrer">
                  Open a Pull Request
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

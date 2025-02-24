import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

export function TryNowSection() {
  return (
    <section className="relative mx-auto mt-10 h-full max-w-[1000px] space-y-8 px-4 py-28">
      <Card className="space-y-4 py-10">
        <CardHeader>
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Try Ducket now</h2>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              Start using Ducket today and experience a different file storage solution.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mx-auto flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/sign-in">Start your project</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Link href="/docs">Read documentation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

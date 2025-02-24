import { HomeCopyButton } from '../landing/copy-button';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function DocsInstallation() {
  return (
    <section className="mx-auto mt-5 flex flex-col items-center justify-center space-y-4">
      <p className="max-w-[80ch] text-muted-foreground">
        Start using Ducket funcionality by installing the NPM package.
      </p>
      <div className="relative mr-auto flex h-12 w-full max-w-[500px] items-center justify-between gap-2">
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
    </section>
  );
}

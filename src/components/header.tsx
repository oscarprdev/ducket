import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function Header() {
  return (
    <div className="pt-8">
      <div className="mx-auto max-w-[800px] px-4">
        <header className="rounded-lg border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between pl-6 pr-2">
            <Link href="/" className="text-xl font-bold">
              Ducket
            </Link>
            <nav className="flex items-center gap-8">
              <div className="hidden items-center gap-6 md:flex">
                <Link
                  href="#features"
                  className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                  Docs
                </Link>
              </div>
              <div className="flex items-center">
                <Button asChild variant="outline">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function Header() {
  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-8">
      <header className="mx-auto max-w-[800px] rounded-lg border border-border bg-background">
        <div className="flex h-14 items-center justify-between pl-6 pr-2">
          <Link href="/" className="text-xl font-bold">
            Ducket
          </Link>
          <nav className="flex items-center gap-8">
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/features"
                className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                Features
              </Link>
              <Link
                href="/community"
                className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                Community
              </Link>
              <Link
                href="/developers"
                className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                Developers
              </Link>
              <Link
                href="/about"
                className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                About
              </Link>
              <Link
                href="/pricing"
                className="text-sm transition-colors duration-300 hover:text-muted-foreground">
                Pricing
              </Link>
            </div>
            <div className="flex items-center">
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

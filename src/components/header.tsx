import { ThemeToggle } from './theme-toggle';
import { User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function Header() {
  return (
    <header
      className={cn('sticky left-0 top-0 z-10 w-screen border-b border-border bg-background px-5')}>
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold">Ducket</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}

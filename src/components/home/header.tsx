import { HeaderNav } from './header-nav';
import Link from 'next/link';

export function Header() {
  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4 sm:pt-8">
      <header className="mx-auto max-w-[800px] rounded-lg border border-border bg-background">
        <div className="flex h-14 items-center justify-between pl-6 pr-2">
          <Link href="/" className="text-xl font-bold">
            Ducket
          </Link>
          <HeaderNav />
        </div>
      </header>
    </div>
  );
}

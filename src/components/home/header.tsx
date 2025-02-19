'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4 sm:pt-8">
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
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden">
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            isOpen ? 'max-h-[400px] border-t border-border' : 'max-h-0'
          )}>
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/features"
              className="rounded-md p-2 text-sm transition-colors duration-300 hover:bg-muted">
              Features
            </Link>
            <Link
              href="/community"
              className="rounded-md p-2 text-sm transition-colors duration-300 hover:bg-muted">
              Community
            </Link>
            <Link
              href="/developers"
              className="rounded-md p-2 text-sm transition-colors duration-300 hover:bg-muted">
              Developers
            </Link>
            <Link
              href="/about"
              className="rounded-md p-2 text-sm transition-colors duration-300 hover:bg-muted">
              About
            </Link>
            <Link
              href="/pricing"
              className="rounded-md p-2 text-sm transition-colors duration-300 hover:bg-muted">
              Pricing
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

'use client';

import { HeaderNav } from './header-nav';
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
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <HeaderNav />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden">
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            isOpen ? 'max-h-[500px] border-t border-border' : 'max-h-0'
          )}>
          <HeaderNav isMobile />
        </div>
      </header>
    </div>
  );
}

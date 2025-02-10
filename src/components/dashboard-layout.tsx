import { ThemeToggle } from './theme-toggle';
import { User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { Button } from '~/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export default function DashboardLayout({ children, sidebarContent }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      {/* Header */}
      <header className="sticky left-0 top-0 w-full border-b border-white/10 bg-background">
        <div className="container flex h-16 items-center justify-between">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64">{sidebarContent}</aside>

        {/* Main content */}
        <main className="relative flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

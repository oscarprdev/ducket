import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-40 w-full border-b">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Ducket</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <LayoutDashboard className="h-4 w-4" />
              <span>Projects</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

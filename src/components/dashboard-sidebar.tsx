import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardSidebar() {
  return (
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
  );
}

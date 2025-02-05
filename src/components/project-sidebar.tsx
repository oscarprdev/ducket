import { FileText, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';

interface ProjectSidebarProps {
  projectId: string;
}

export default function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  return (
    <nav className="space-y-2">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <LayoutDashboard className="h-4 w-4" />
        <span>All Projects</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/overview`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <FileText className="h-4 w-4" />
        <span>Overview</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/team`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <Users className="h-4 w-4" />
        <span>Team</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/settings`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}

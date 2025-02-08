import { Files, KeyRound, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';

interface ProjectSidebarProps {
  projectId: string;
}

export default function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  return (
    <nav className="space-y-2">
      <Link
        href={`/dashboard/${projectId}`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <LayoutDashboard className="h-4 w-4" />
        <span>Overview</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/files`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <Files className="h-4 w-4" />
        <span>Files</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/team`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <Users className="h-4 w-4" />
        <span>Team</span>
      </Link>
      <Link
        href={`/dashboard/${projectId}/api-keys`}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <KeyRound className="h-4 w-4" />
        <span>Api keys</span>
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

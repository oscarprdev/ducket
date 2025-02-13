'use client';

import { Activity, FileText, FolderOpen, Key, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarItem, SidebarSection } from '~/components/ui/sidebar';

interface ProjectSidebarProps {
  projectId: string;
}

export default function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const items = [
    {
      title: 'Overview',
      icon: <FileText className="h-5 w-5" />,
      href: `/dashboard/${projectId}`,
    },
    {
      title: 'Files',
      icon: <FolderOpen className="h-5 w-5" />,
      href: `/dashboard/${projectId}/files`,
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: `/dashboard/${projectId}/users`,
    },
    {
      title: 'Activity',
      icon: <Activity className="h-5 w-5" />,
      href: `/dashboard/${projectId}/activity`,
    },
    {
      title: 'API keys',
      icon: <Key className="h-5 w-5" />,
      href: `/dashboard/${projectId}/api-keys`,
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: `/dashboard/${projectId}/settings`,
    },
  ];

  return (
    <Sidebar className="fixed">
      <SidebarSection title="Project">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="mr-auto block w-full">
            <SidebarItem icon={item.icon} title={item.title} href={item.href} />
          </Link>
        ))}
      </SidebarSection>
    </Sidebar>
  );
}

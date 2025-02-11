'use client';

import { FileText, FolderOpen, Key, Settings } from 'lucide-react';
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
      title: 'API Keys',
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
    <Sidebar>
      <SidebarSection title="Project">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="block w-full">
            <SidebarItem icon={item.icon} title={item.title} href={item.href} />
          </Link>
        ))}
      </SidebarSection>
    </Sidebar>
  );
}

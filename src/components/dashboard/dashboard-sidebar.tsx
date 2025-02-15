'use client';

import { LayoutDashboard, Mails, Settings } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarItem, SidebarSection } from '~/components/ui/sidebar';

export default function DashboardSidebar() {
  const items = [
    {
      title: 'Projects',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard',
    },
    {
      title: 'Invitations',
      icon: <Mails className="h-5 w-5" />,
      href: '/dashboard/invitations',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/dashboard/settings',
    },
  ];

  return (
    <Sidebar>
      <SidebarSection title="Menu">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="mr-auto block w-full">
            <SidebarItem icon={item.icon} title={item.title} href={item.href} />
          </Link>
        ))}
      </SidebarSection>
    </Sidebar>
  );
}

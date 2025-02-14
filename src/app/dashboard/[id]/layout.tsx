import type React from 'react';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import ProjectSidebar from '~/components/dashboard/project-sidebar';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout sidebarContent={<ProjectSidebar projectId={id} />}>
      <div className="h-full">{children}</div>
    </DashboardLayout>
  );
}

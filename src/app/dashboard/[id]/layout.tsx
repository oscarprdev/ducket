import type React from 'react';
import DashboardLayout from '~/components/dashboard-layout';
import ProjectSidebar from '~/components/project-sidebar';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout sidebarContent={<ProjectSidebar projectId={id} />}>{children}</DashboardLayout>
  );
}

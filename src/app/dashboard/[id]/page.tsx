import DashboardLayout from '~/components/dashboard-layout';
import ProjectSidebar from '~/components/project-sidebar';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <DashboardLayout sidebarContent={<ProjectSidebar projectId={id} />}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Details</h1>
      </div>
      <p>Project ID: {id}</p>
    </DashboardLayout>
  );
}

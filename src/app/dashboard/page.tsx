import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import { CreateProjectDialog } from '~/components/dashboard/projects/create-project-dialog';
import ProjectCard from '~/components/dashboard/projects/project-card';
import { ProjectListSkeleton } from '~/components/dashboard/projects/project-card-skeleton';
import { formatDate } from '~/lib/utils';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProjectsListSSR({ userId }: { userId: string }) {
  const [ownedProjects, sharedProjects] = await Promise.all([
    QUERIES.projects.getAll({ ownerId: userId }),
    QUERIES.projects.getShared({ userId }),
  ]);

  const allProjects = [...ownedProjects, ...sharedProjects].sort(p => p.createdAt.getTime());

  return (
    <div className="grid min-h-[200px] gap-4 md:grid-cols-2 lg:grid-cols-3">
      {allProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects created yet</p>
      ) : (
        allProjects.map(project => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            owner={project.user}
            createdAt={formatDate(project.createdAt)}
            maxSize={project.maxSize}
            isOwned={project.ownerId === userId}
            files={project.files}
          />
        ))
      )}
    </div>
  );
}

export default async function Dashboard() {
  const session = await auth();
  if (!session || session.expires < new Date().toISOString()) return redirect('/sign-in');

  return (
    <DashboardLayout sidebarContent={<DashboardSidebar />}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <CreateProjectDialog />
      </div>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectsListSSR userId={session.user.id} />
      </Suspense>
    </DashboardLayout>
  );
}

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import { CreateProjectDialog } from '~/components/dashboard/projects/create-project-dialog';
import { ProjectListSkeleton } from '~/components/dashboard/projects/project-card-skeleton';
import { ProjectCardSSR } from '~/components/dashboard/projects/project-card-ssr';
import { INVITATION_STATES } from '~/lib/constants';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProjectsListSSR({ userId }: { userId: string }) {
  const projects = await QUERIES.projects.getAll({ ownerId: userId });

  return (
    <div className="grid min-h-[200px] gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects created yet</p>
      ) : (
        projects.map(project => (
          <ProjectCardSSR key={project.id} project={project} isOwned={true} />
        ))
      )}
    </div>
  );
}

async function SharedProjectsListSSR({ userId }: { userId: string }) {
  const [userInfo] = await QUERIES.users.getById({ id: userId });
  if (!userInfo) redirect('/sign-in');
  const projectUsers = await QUERIES.projectUsers.getNoOwned({ email: userInfo.email });
  const projectsAccepted = projectUsers.filter(
    projectUser => projectUser.state === INVITATION_STATES.accepted
  );
  const projects = await Promise.all(
    projectsAccepted.map(projectUser =>
      QUERIES.projects.getById({ projectId: projectUser.projectId })
    )
  );

  return (
    <>
      <h2 className="mt-10 text-xl font-bold text-primary/80">Sharing with you</h2>
      <div className="mt-5 grid min-h-[200px] gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects shared with you yet.</p>
        ) : (
          projects
            .flat()
            .map(project => <ProjectCardSSR key={project.id} project={project} isOwned={false} />)
        )}
      </div>
    </>
  );
}

export default async function Dashboard() {
  const session = await auth();
  if (!session || session.expires < new Date().toISOString()) return redirect('/sign-in');

  return (
    <DashboardLayout sidebarContent={<DashboardSidebar />}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <CreateProjectDialog />
      </div>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectsListSSR userId={session.user.id} />
      </Suspense>

      <Suspense fallback={<ProjectListSkeleton />}>
        <SharedProjectsListSSR userId={session.user.id} />
      </Suspense>
    </DashboardLayout>
  );
}

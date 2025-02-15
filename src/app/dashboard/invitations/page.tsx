import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import InvitationsTable, {
  type ProjectWithUserAndPermissions,
} from '~/components/dashboard/invitations/invitations-table';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function InvitationsSSR({ userId }: { userId: string }) {
  const [userInfo] = await QUERIES.users.getById({ id: userId });
  if (!userInfo?.email) {
    redirect('/sign-in');
  }
  const projectsUsers = await QUERIES.projectUsers.getByUserEmail({
    email: userInfo.email,
  });
  const projectPromises = projectsUsers.map(project =>
    QUERIES.projects.getById({ projectId: project.projectId }).then(([projectInfo]) => ({
      ...projectInfo,
      permissions: project.permissions,
      invitationState: project.state,
      createdAt: project.createdAt,
      invitedUserEmail: project.email,
    }))
  );
  const projects = await Promise.all(projectPromises);

  const projectsToDisplay = projects.filter(project => project.ownerId !== userId);

  const projectsToDisplayPromises = projectsToDisplay.map(project => {
    if (!project?.ownerId) return Promise.resolve(false);
    return QUERIES.users.getById({ id: project.ownerId }).then(([projectUsers]) => ({
      ...project,
      ownerId: projectUsers?.email ?? project.ownerId,
    }));
  });
  const projectsWithUsers = await Promise.all(projectsToDisplayPromises);

  return <InvitationsTable projects={projectsWithUsers as ProjectWithUserAndPermissions[]} />;
}

export default async function InvitationsPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign-in');
  }
  return (
    <DashboardLayout sidebarContent={<DashboardSidebar />}>
      <Suspense fallback={<div>Loading...</div>}>
        <InvitationsSSR userId={session.user.id} />
      </Suspense>
    </DashboardLayout>
  );
}

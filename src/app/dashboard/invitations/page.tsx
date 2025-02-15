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
  const projects = await Promise.all(
    projectsUsers.map(async project => {
      const [projectInfo] = await QUERIES.projects.getById({ projectId: project.projectId });

      return {
        ...projectInfo,
        permissions: project.permissions,
        invitationState: project.state,
        createdAt: project.createdAt,
        invitedUserEmail: project.email,
      };
    })
  );

  const projectsToDisplay = projects.filter(project => project.ownerId !== userId);

  const projectsWithUsers = await Promise.all(
    projectsToDisplay.map(async project => {
      if (!project?.ownerId) return false;
      const [projectUsers] = await QUERIES.users.getById({ id: project.ownerId });
      return { ...project, ownerId: projectUsers?.email ?? project.ownerId };
    })
  );

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

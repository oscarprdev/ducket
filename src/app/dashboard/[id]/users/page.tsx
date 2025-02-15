import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { InviteUserDialog } from '~/components/dashboard/users/invite-user-dialog';
import { UsersTableSkeleton } from '~/components/dashboard/users/users-skeletons';
import UsersTable from '~/components/dashboard/users/users-table';
import { INVITATION_STATES, type InvitationState } from '~/lib/constants';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProjectUsersSSR({
  projectId,
  isOwner,
  ownerId,
}: {
  projectId: string;
  isOwner: boolean;
  ownerId: string;
}) {
  const users = await QUERIES.projectUsers.getByProjectId({ projectId });
  const userPromises = users.map(user =>
    QUERIES.users.getByEmail({ email: user.email }).then(([userData]) => {
      const isValidState = (state: string): state is InvitationState => {
        return Object.values(INVITATION_STATES).includes(state as InvitationState);
      };
      return {
        id: userData?.id ?? '-',
        name: userData?.name ?? '-',
        email: userData?.email ?? '-',
        permissions: user.permissions,
        state: isValidState(user.state) ? user.state : INVITATION_STATES.pending,
        isOwner: ownerId === userData?.id,
      };
    })
  );

  const usersData = await Promise.all(userPromises);
  return <UsersTable projectId={projectId} users={usersData} isOwner={isOwner} ownerId={ownerId} />;
}

export default async function UsersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const user = session.user;
  const [projectUser] = await QUERIES.projects.getById({ projectId: id });
  if (!projectUser) redirect('/dashboard');

  const isOwner = projectUser.ownerId === user.id;

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your project files in one place.
          </p>
        </div>
        {isOwner && <InviteUserDialog projectId={id} />}
      </div>
      <Suspense fallback={<UsersTableSkeleton />}>
        <ProjectUsersSSR projectId={id} isOwner={isOwner} ownerId={projectUser.ownerId} />
      </Suspense>
    </section>
  );
}

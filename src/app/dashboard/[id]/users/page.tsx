import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { InviteUserDialog } from '~/components/users/invite-user-dialog';
import { UsersTableSkeleton } from '~/components/users/users-skeletons';
import UsersTable from '~/components/users/users-table';
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
  const usersData = await Promise.all(
    users.map(async user => {
      const [userData] = await QUERIES.users.getByEmail({ email: user.email });

      return {
        id: userData?.id ?? '-',
        name: userData?.name ?? '-',
        email: userData?.email ?? '-',
        permissions: user.permissions,
        confirmed: user.confirmed,
        isOwner: ownerId === userData?.id,
      };
    })
  );
  return <UsersTable projectId={projectId} users={usersData} isOwner={isOwner} ownerId={ownerId} />;
}

export default async function UsersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const user = session.user;
  const [projectUser] = await QUERIES.projects.getByOwner({ userId: user.id });
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

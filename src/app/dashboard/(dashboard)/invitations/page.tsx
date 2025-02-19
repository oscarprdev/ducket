import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import InvitationsTable from '~/components/dashboard/invitations/invitations-table';
import { InvitationsTableSkeleton } from '~/components/dashboard/invitations/invitations-table-skeleton';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function InvitationsSSR({ userId }: { userId: string }) {
  const [userInfo] = await QUERIES.users.getById({ id: userId });
  if (!userInfo?.email) {
    redirect('/sign-in');
  }

  const projects = await QUERIES.projectUsers.getInvitations({ email: userInfo.email });

  return <InvitationsTable projects={projects} />;
}

export default async function InvitationsPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign-in');
  }
  return (
    <Suspense fallback={<InvitationsTableSkeleton />}>
      <InvitationsSSR userId={session.user.id} />
    </Suspense>
  );
}

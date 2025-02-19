import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { TransfersSkeleton } from '~/components/dashboard/transfers/transfers-skeleton';
import { TransfersTable } from '~/components/dashboard/transfers/transfers-table';
import { TabsContent } from '~/components/ui/tabs';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function OutgoingTransfersSSR({ userId }: { userId: string }) {
  const transfers = await QUERIES.transferRequests.getOutgoing({ userId });
  return <TransfersTable transfers={transfers} />;
}

export default async function OutgoingTransfersPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign-in');
  }
  return (
    <TabsContent value="outgoing">
      <Suspense fallback={<TransfersSkeleton />}>
        <OutgoingTransfersSSR userId={session.user.id} />
      </Suspense>
    </TabsContent>
  );
}

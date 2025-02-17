import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { TransfersSkeleton } from '~/components/dashboard/transfers/transfers-skeleton';
import { TransfersTable } from '~/components/dashboard/transfers/transfers-table';
import { TabsContent } from '~/components/ui/tabs';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function IncomingTransfersSSR({ userId }: { userId: string }) {
  const transfers = await QUERIES.transferRequests.getIncoming({ userId });
  return <TransfersTable transfers={transfers} />;
}

export default async function IncomingTransfersPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign-in');
  }
  return (
    <TabsContent value="incoming">
      <Suspense fallback={<TransfersSkeleton />}>
        <IncomingTransfersSSR userId={session.user.id} />
      </Suspense>
    </TabsContent>
  );
}

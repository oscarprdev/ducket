import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CreateProposalDialog } from '~/components/dashboard/proposals/create-proposal-dialog';
import {
  ProposalsCard,
  ProposalsCardSkeleton,
} from '~/components/dashboard/proposals/proposals-card';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProposalsGridSSR({ userId }: { userId: string }) {
  const proposals = await QUERIES.proposals.getByUserId({ userId });
  const proposalsWithLikes = proposals.map(proposal => ({
    ...proposal,
    likesCount: proposal.likes.length,
    isLiked: proposal.likes.some(like => like.userId === userId),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {proposalsWithLikes.length > 0 ? (
        proposalsWithLikes.map(proposal => (
          <ProposalsCard
            key={proposal.id}
            id={proposal.id}
            title={proposal.title}
            description={proposal.description}
            createdAt={proposal.createdAt}
            userImage={proposal.user.image ?? undefined}
            userName={proposal.user.name ?? undefined}
            isLiked={proposal.isLiked}
            likesCount={proposal.likesCount}
            canLike={!proposal.isLiked}
            isOwner={proposal.userId === userId}
          />
        ))
      ) : (
        <div className="col-span-full">
          <p className="text-center text-muted-foreground">No proposals found. Create one now!</p>
        </div>
      )}
    </div>
  );
}

export default async function DashboardProposalsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proposals</h2>
          <p className="text-muted-foreground">
            View and manage your proposals or create new ones.
          </p>
        </div>
        <CreateProposalDialog />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProposalsCardSkeleton key={index} />
            ))}
          </div>
        }>
        <ProposalsGridSSR userId={session.user.id} />
      </Suspense>
    </div>
  );
}

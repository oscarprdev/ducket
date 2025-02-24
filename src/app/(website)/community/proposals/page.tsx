import { Suspense } from 'react';
import { CreateProposalDialog } from '~/components/website/community/create-proposal-dialog';
import {
  ProposalsCard,
  ProposalsCardSkeleton,
} from '~/components/website/community/proposals-card';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProposalsGridSSR({ userId }: { userId?: string }) {
  const proposals = await QUERIES.proposals.getAll({ userId });
  const [userInfo] = userId ? await QUERIES.users.getById({ id: userId }) : [null];

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {proposals.length > 0 ? (
        proposals.map(proposal => (
          <ProposalsCard
            key={proposal.id}
            id={proposal.id}
            title={proposal.title}
            description={proposal.description}
            createdAt={proposal.createdAt}
            userImage={userInfo?.image ?? undefined}
            isLiked={proposal.isLiked}
            likesCount={proposal.likesCount}
            canLike={!!userId && !proposal.isLiked}
          />
        ))
      ) : (
        <div className="col-span-full">
          <p className="text-center text-muted-foreground">Be the first to propose a feature!</p>
        </div>
      )}
    </div>
  );
}

export default async function ProposalsPage() {
  const session = await auth();

  return (
    <section className="relative mx-auto mt-12 max-w-[1200px] space-y-4 bg-background px-4 py-8 sm:mt-16 sm:space-y-6 sm:py-10 md:mt-20 md:space-y-8 md:py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-10">
        <div>
          <h1 className="pointer-events-none text-4xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Proposals
          </h1>
          <p className="max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl">
            Check out the following proposals from the community.
          </p>
        </div>
        {session?.user && <CreateProposalDialog />}
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <ProposalsCardSkeleton key={index} />
            ))}
          </div>
        }>
        <ProposalsGridSSR userId={session?.user.id} />
      </Suspense>
    </section>
  );
}

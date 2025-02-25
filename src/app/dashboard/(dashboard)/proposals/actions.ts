'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const deleteProposalSchema = z.object({
  proposalId: z.string({ message: 'Proposal ID is required' }),
});

export const deleteProposal = validatedActionWithUser(
  deleteProposalSchema,
  async (data, _, user) => {
    try {
      const { proposalId } = data;

      const proposal = await QUERIES.proposals.getById({ id: proposalId });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      if (proposal.userId !== user.id) {
        throw new Error('You are not authorized to delete this proposal');
      }

      await MUTATIONS.proposals.delete({ id: proposalId });

      revalidatePath('/dashboard/proposals');

      return { success: 'Proposal deleted successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error deleting proposal',
      };
    }
  }
);

'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';

const createProposalSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
});

export const createProposal = validatedActionWithUser(
  createProposalSchema,
  async (data, _, user) => {
    try {
      const { title, description } = data;

      await MUTATIONS.proposals.create({
        userId: user.id,
        title,
        description,
      });

      revalidatePath('/community/proposals');
      revalidatePath('/dashboard/proposals');

      return { success: 'Proposal created successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error creating proposal',
      };
    }
  }
);

const toggleLikeSchema = z.object({
  proposalId: z.string(),
});

export const toggleLike = validatedActionWithUser(toggleLikeSchema, async (data, _, user) => {
  try {
    const { proposalId } = data;

    const result = await MUTATIONS.proposals.toggleLike({
      proposalId,
      userId: user.id,
    });

    revalidatePath('/community/proposals');
    return { success: result.liked ? 'Proposal liked' : 'Proposal unliked' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error toggling like',
    };
  }
});

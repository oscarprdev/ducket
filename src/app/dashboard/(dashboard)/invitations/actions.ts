'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';

const acceptInvitationSchema = z.object({
  projectId: z.string(),
  email: z.string(),
});

export const acceptInvitation = validatedActionWithUser(acceptInvitationSchema, async (data, _) => {
  try {
    const { projectId, email } = data;

    await MUTATIONS.projectUsers.acceptInvitation({
      projectId,
      email,
    });

    revalidatePath('/dashboard/invitations');

    return { success: 'Invitation accepted successfully' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error accepting invitation',
    };
  }
});

const declineInvitationSchema = z.object({
  projectId: z.string(),
  email: z.string(),
});

export const declineInvitation = validatedActionWithUser(
  declineInvitationSchema,
  async (data, _) => {
    try {
      const { projectId, email } = data;

      await MUTATIONS.projectUsers.declineInvitation({
        projectId,
        email,
      });

      revalidatePath('/dashboard/invitations');

      return { success: 'Invitation declined successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error declining invitation',
      };
    }
  }
);

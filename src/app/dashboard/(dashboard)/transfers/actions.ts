'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { type ApiKeyPermissions } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const acceptTransferSchema = z.object({
  transferId: z.string(),
});

export const acceptTransfer = validatedActionWithUser(
  acceptTransferSchema,
  async (data, _, user) => {
    try {
      const { transferId } = data;
      const transfers = await QUERIES.transferRequests.getIncoming({ userId: user.id });
      const transfer = transfers.find(t => t.id === transferId);

      if (!transfer) {
        throw new Error('Transfer request not found');
      }

      if (!user.email) {
        throw new Error('User email not found');
      }

      const projectUsers = await QUERIES.projectUsers.getByProjectId({
        projectId: transfer.projectId,
      });
      const findOnwer = projectUsers.find(p => p.isOwner);

      if (!findOnwer) {
        throw new Error('Owner not found');
      }

      const findUser = projectUsers.find(p => p.email === user.email);

      if (!findUser) {
        throw new Error('User not found');
      }

      await Promise.all([
        MUTATIONS.transferRequests.accept({ id: transferId }),
        MUTATIONS.projectUsers.editPermissions({
          projectId: transfer.projectId,
          email: findOnwer.email,
          permissions: findUser.permissions as ApiKeyPermissions[],
        }),
        MUTATIONS.projectUsers.updateOwnership({
          projectId: transfer.projectId,
          newOwnerEmail: user.email,
        }),
        MUTATIONS.projectUsers.removeOwnership({
          projectId: transfer.projectId,
          email: findOnwer.email,
        }),
        MUTATIONS.projects.transfer({
          projectId: transfer.projectId,
          ownerId: user.id,
        }),
      ]);

      revalidatePath('/dashboard/transfers/incoming');
      revalidatePath('/dashboard');

      return { success: 'Transfer accepted successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error accepting transfer',
      };
    }
  }
);

const declineTransferSchema = z.object({
  transferId: z.string(),
});

export const declineTransfer = validatedActionWithUser(
  declineTransferSchema,
  async (data, _, user) => {
    try {
      const { transferId } = data;
      const transfers = await QUERIES.transferRequests.getIncoming({ userId: user.id });
      const transfer = transfers.find(t => t.id === transferId);

      if (!transfer) {
        throw new Error('Transfer request not found');
      }

      await MUTATIONS.transferRequests.decline({ id: transferId });

      revalidatePath('/dashboard/transfers/incoming');

      return { success: 'Transfer declined successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error declining transfer',
      };
    }
  }
);

'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { extractPermissions } from '~/lib/utils';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

const editUserPermissionsSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const editUserPermissions = validatedActionWithUser(
  editUserPermissionsSchema,
  async data => {
    const { projectId, userId, read, write, delete: deletePermission } = data;
    const permissions = extractPermissions(read, write, deletePermission);
    if (permissions.length === 0) {
      return { error: 'Please select at least one permission' };
    }

    const [user] = await QUERIES.projectUsers.getByUserId({ userId });
    if (user?.projectId !== projectId) {
      return { error: 'User is not in this project' };
    }

    await MUTATIONS.editUserPermissions({
      projectId,
      userId,
      permissions,
    });

    revalidatePath(`/dashboard/${projectId}/users`);

    return { success: 'User permissions edited successfully' };
  }
);

const removeUserSchema = z.object({
  projectId: z.string({ message: 'Project ID is required' }),
  userId: z.string({ message: 'User ID is required' }),
});

export const removeUser = validatedActionWithUser(removeUserSchema, async (data, _, user) => {
  const { projectId, userId } = data;

  const project = await QUERIES.projects.getById({ projectId });
  if (!project[0] || project[0].ownerId !== user.id) {
    throw new Error('Unauthorized');
  }

  await MUTATIONS.removeUser({
    projectId,
    userId,
  });

  revalidatePath(`/dashboard/${projectId}/users`);

  return { success: 'User removed successfully' };
});

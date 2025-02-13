'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { extractPermissions } from '~/lib/utils';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

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

    await MUTATIONS.projectUsers.editPermissions({
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

  await MUTATIONS.projectUsers.remove({
    projectId,
    userId,
  });

  revalidatePath(`/dashboard/${projectId}/users`);

  return { success: 'User removed successfully' };
});

const inviteUserSchema = z.object({
  projectId: z.string(),
  email: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});

export const inviteUser = validatedActionWithUser(inviteUserSchema, async (data, _, user) => {
  const { projectId, email, read, write, delete: deletePermission } = data;
  const permissions = extractPermissions(read, write, deletePermission);
  const project = await QUERIES.projects.getById({ projectId });
  if (!project[0] || project[0].ownerId !== user.id) {
    throw new Error('Unauthorized');
  }

  const [userResponse] = await QUERIES.users.getByEmail({ email });
  if (!userResponse) {
    return { error: 'User does not exist' };
  }

  // TODO: Send invitation email with resend

  await MUTATIONS.projectUsers.invite({
    projectId,
    userId: userResponse.id,
    permissions,
  });

  revalidatePath(`/dashboard/${projectId}/users`);

  return { success: 'User invited successfully' };
});

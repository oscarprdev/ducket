'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { INVITATION_STATES } from '~/lib/constants';
import { extractPermissions } from '~/lib/utils';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';
import { sendInvitationEmail } from '~/server/email';

const editUserPermissionsSchema = z.object({
  projectId: z.string({ message: 'Project ID is required' }),
  email: z.string({ message: 'Email is required' }),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const editUserPermissions = validatedActionWithUser(
  editUserPermissionsSchema,
  async data => {
    try {
      const { projectId, email, read, write, delete: deletePermission } = data;
      const permissions = extractPermissions(read, write, deletePermission);
      if (permissions.length === 0) {
        throw new Error('Please select at least one permission');
      }

      const [user] = await QUERIES.projectUsers.getByUserEmail({ email });
      if (user?.projectId !== projectId) {
        throw new Error('User is not in this project');
      }

      await MUTATIONS.projectUsers.editPermissions({
        projectId,
        email,
        permissions,
      });

      revalidatePath(`/dashboard/${projectId}/users`);

      return { success: 'User permissions edited successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Error editing user permissions',
      };
    }
  }
);

const removeUserSchema = z.object({
  projectId: z.string({ message: 'Project ID is required' }),
  userId: z.string({ message: 'User ID is required' }),
});

export const removeUser = validatedActionWithUser(removeUserSchema, async (data, _, user) => {
  try {
    const { projectId, userId } = data;

    const [project] = await QUERIES.projects.getById({ projectId });
    if (!project || project.ownerId !== user.id) {
      throw new Error('Unauthorized');
    }

    const [userResponse] = await QUERIES.users.getById({ id: userId });
    if (!userResponse) {
      throw new Error('User not found');
    }

    if (project.ownerId === userResponse.id) {
      throw new Error('Project owner cannot be deleted');
    }

    await MUTATIONS.projectUsers.remove({
      projectId,
      email: userResponse.email,
    });

    revalidatePath(`/dashboard/${projectId}/users`);

    return { success: 'User removed successfully' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error removing user',
    };
  }
});

const inviteUserSchema = z.object({
  projectId: z.string(),
  email: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});

export const inviteUser = validatedActionWithUser(inviteUserSchema, async (data, _, user) => {
  try {
    const { projectId, email, read, write, delete: deletePermission } = data;
    const permissions = extractPermissions(read, write, deletePermission);
    const project = await QUERIES.projects.getById({ projectId });
    if (!project[0] || project[0].ownerId !== user.id) {
      throw new Error('Unauthorized');
    }

    await MUTATIONS.projectUsers.invite({
      projectId,
      email,
      permissions,
      state: INVITATION_STATES.pending,
    });

    await sendInvitationEmail({
      to: email,
      link: `${env.API_URL}/sign-in?email=${email}`,
    });

    revalidatePath(`/dashboard/${projectId}/users`);

    return { success: 'User invited successfully' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error inviting user',
    };
  }
});

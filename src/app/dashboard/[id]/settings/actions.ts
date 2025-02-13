'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const updateProjectTitleSchema = z.object({
  projectId: z.string().min(1, { message: 'Project ID is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
});

export const updateProjectTitle = validatedActionWithUser(updateProjectTitleSchema, async data => {
  try {
    const { projectId, title } = data;

    await MUTATIONS.projects.update({ projectId, title });

    revalidatePath(`/dashboard/${projectId}/settings`);

    return { success: 'Project title updated successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update project title' };
  }
});

const transferProjectSchema = z.object({
  projectId: z.string().min(1, { message: 'Project ID is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const transferProject = validatedActionWithUser(transferProjectSchema, async data => {
  try {
    const { projectId, email } = data;

    const [project] = await QUERIES.projects.getById({ projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    const [user] = await QUERIES.users.getByEmail({ email });

    if (!user) {
      return { error: 'There is no user logged in with this email' };
    }

    if (user.id === project.ownerId) {
      return { error: 'You cannot transfer the project to yourself' };
    }

    // TODO: Notify the new owner with resend email

    await MUTATIONS.projects.transfer({ projectId, ownerId: user.id });

    revalidatePath(`/dashboard/${projectId}/settings`);

    return { success: 'Project transferred successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to transfer project' };
  }
});

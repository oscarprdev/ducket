'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';

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

'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/queries';
import generateApiKey from '~/server/utils/generate-api-key';

const createProjectsSchema = z.object({
  title: z.string().max(10, { message: 'Project title cannot exceed 10 characters' }),
});

export const createProject = validatedActionWithUser(
  createProjectsSchema,
  async (data, _, user) => {
    const { title } = data;
    const apiKey = generateApiKey();

    await MUTATIONS.createProject({
      ownerId: user.id,
      title,
      apiKey,
    });

    revalidatePath('/dashboard');

    return { success: 'Project created successfully' };
  }
);

'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';
import generateApiKey from '~/server/utils/generate-api-key';

const createProjectsSchema = z.object({
  title: z.string().max(10, { message: 'Project title cannot exceed 10 characters' }),
});

export const createProject = validatedActionWithUser(
  createProjectsSchema,
  async (data, _, user) => {
    const { title } = data;
    const apiKey = generateApiKey();

    await MUTATIONS.projects.create({
      ownerId: user.id,
      title,
      apiKey,
    });

    revalidatePath('/dashboard');

    return { success: 'Project created successfully' };
  }
);

const editProjectSchema = z.object({
  projectId: z.string(),
  title: z.string().max(10, { message: 'Project title cannot exceed 10 characters' }),
});

export const editProject = validatedActionWithUser(editProjectSchema, async (data, _, user) => {
  const { projectId, title } = data;

  const project = await QUERIES.projects.getById({ projectId });
  if (!project[0] || project[0].ownerId !== user.id) {
    throw new Error('Unauthorized');
  }

  await MUTATIONS.projects.update({
    projectId,
    title,
  });

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/${projectId}/settings`);

  return { success: 'Project updated successfully' };
});

const deleteProjectSchema = z.object({
  projectId: z.string({ message: 'Project ID is required' }),
});

export const deleteProject = validatedActionWithUser(deleteProjectSchema, async (data, _, user) => {
  const { projectId } = data;

  const project = await QUERIES.projects.getById({ projectId });
  if (!project[0] || project[0].ownerId !== user.id) {
    throw new Error('Unauthorized');
  }

  await MUTATIONS.projects.delete({
    projectId,
  });

  revalidatePath('/dashboard', 'page');

  return { success: 'Project deleted successfully' };
});

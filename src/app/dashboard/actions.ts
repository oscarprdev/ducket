'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { signOut } from '~/server/auth';
import { validatedActionWithPermissions, validatedActionWithUser } from '~/server/auth/middleware';
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
  projectName: z.string({ message: 'Project Name is required' }),
});

export const deleteProject = validatedActionWithPermissions(
  deleteProjectSchema,
  [API_KEY_PERMISSIONS.delete, API_KEY_PERMISSIONS.all],
  async (data, _, user, secret) => {
    try {
      const { projectId, projectName } = data;

      const project = await QUERIES.projects.getById({ projectId });
      if (!project[0] || project[0].ownerId !== user.id) {
        throw new Error('Unauthorized');
      }

      if (
        project[0].title.replaceAll(' ', '').toLowerCase() !==
        projectName.replaceAll(' ', '').toLowerCase()
      ) {
        throw new Error('Project name does not match');
      }

      const allFiles = await QUERIES.files.getByProjectId({ projectId });

      const deletePromise = (fileName: string) =>
        fetch(`${env.API_URL}/api/ducket/file/${fileName}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        });

      try {
        await Promise.all(allFiles.map(file => deletePromise(file.fileName ?? '')));
      } catch {
        throw new Error('Failed to delete files from bucket');
      }

      try {
        await Promise.all(
          allFiles.map(file =>
            MUTATIONS.files.delete({
              name: file.fileName ?? '',
            })
          )
        );
      } catch {
        throw new Error('Failed to delete files from database');
      }

      try {
        await MUTATIONS.projects.delete({
          projectId,
        });
      } catch {
        throw new Error('Failed to delete project from database');
      }

      revalidatePath('/dashboard');
      revalidatePath(`/dashboard/${projectId}`);
      revalidatePath(`/dashboard/${projectId}/settings`);

      return { success: 'Project deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete project' };
    }
  }
);

export const signOutAction = async () => {
  const response = await signOut({ redirectTo: '/sign-in' });

  console.log(response);
};

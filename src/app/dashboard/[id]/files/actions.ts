'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { ACTIVITY_ACTIONS, API_KEY_PERMISSIONS, VALID_FILE_TYPES } from '~/lib/constants';
import { validatedActionWithPermissions } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const uploadFileSchema = z.object({
  file: z
    .any()
    .refine(
      (file: unknown): file is { type: string } =>
        typeof file === 'object' &&
        file !== null &&
        'type' in file &&
        Object.values(VALID_FILE_TYPES).some(types =>
          types.includes((file as { type: string }).type)
        ),
      'File type not valid'
    ),
  name: z.string({ message: 'File name is required' }),
  type: z.string({ message: 'File type is required' }),
  projectId: z.string({ message: 'Project ID is required' }),
  userId: z.string({ message: 'User ID is required' }),
});

export const uploadFile = validatedActionWithPermissions(
  uploadFileSchema,
  [API_KEY_PERMISSIONS.write],
  async (data, formData, __, secret) => {
    try {
      const { userId, projectId, name } = data;

      const [file] = await QUERIES.files.getByName({ fileName: name, projectId });

      if (file) {
        return { error: 'File already exists, try with a different name' };
      }

      const response = await fetch(`${env.API_URL}/api/ducket/file?updateLogs=false`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      if (!response.ok) throw new Error(response.statusText);
      await MUTATIONS.activityLogs.create({
        projectId,
        userId,
        fileName: name,
        action: ACTIVITY_ACTIONS.upload,
      });
      revalidatePath(`/dashboard/${projectId}`);

      return { success: 'File uploaded successfully' };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Error uploading file' };
    }
  }
);

const deleteFileSchema = z.object({
  selectedFile: z.string({ message: 'Selected file is required' }),
  projectId: z.string({ message: 'Project ID is required' }),
  userId: z.string({ message: 'User ID is required' }),
});

export const deleteFile = validatedActionWithPermissions(
  deleteFileSchema,
  [API_KEY_PERMISSIONS.delete],
  async (data, _, __, secret) => {
    try {
      const { selectedFile, projectId, userId } = data;

      const response = await fetch(
        `${env.API_URL}/api/ducket/file/${selectedFile}?updateLogs=false`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        }
      );
      if (!response.ok) throw new Error(response.statusText);

      const json = (await response.json()) as { fileDeleted: string; projectId: string };
      await MUTATIONS.activityLogs.create({
        projectId,
        userId,
        fileName: selectedFile,
        action: ACTIVITY_ACTIONS.delete,
      });

      revalidatePath(`/dashboard/${json.projectId}`);

      return { success: 'File deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Error deleting file' };
    }
  }
);

const downloadFileSchema = z.object({
  projectId: z.string(),
  selectedFile: z.string(),
});

export const downloadFile = validatedActionWithPermissions(
  downloadFileSchema,
  [API_KEY_PERMISSIONS.read, API_KEY_PERMISSIONS.write, API_KEY_PERMISSIONS.delete],
  async (data, _, user) => {
    try {
      const { selectedFile, projectId } = data;
      const userId = user.id;

      await MUTATIONS.activityLogs.create({
        projectId,
        userId,
        fileName: selectedFile,
        action: ACTIVITY_ACTIONS.download,
      });

      revalidatePath(`/dashboard/${projectId}`);

      return { success: 'File downloaded successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Error downloading file' };
    }
  }
);

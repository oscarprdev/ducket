'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { ACTIVITY_ACTIONS, API_KEY_PERMISSIONS, VALID_FILE_TYPES } from '~/lib/constants';
import { validatedActionWithPermissions } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/queries';

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
  name: z.string(),
  type: z.string(),
  projectId: z.string(),
});

export const uploadFile = validatedActionWithPermissions(
  uploadFileSchema,
  [API_KEY_PERMISSIONS.write],
  async (_, formData, __, secret) => {
    try {
      const projectId = formData.get('projectId') as string;

      const response = await fetch(`${env.API_URL}/api/ducket/file`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      if (!response.ok) throw new Error(response.statusText);

      revalidatePath(`/dashboard/${projectId}`);

      return { success: 'File uploaded successfully' };
    } catch (error: unknown) {
      console.log(error);
      return { error: error instanceof Error ? error.message : 'Error uploading file' };
    }
  }
);

const deleteFileSchema = z.object({
  selectedFile: z.string(),
  projectId: z.string(),
});

export const deleteFile = validatedActionWithPermissions(
  deleteFileSchema,
  [API_KEY_PERMISSIONS.delete],
  async (data, _, __, secret) => {
    try {
      const { selectedFile } = data;

      const response = await fetch(`${env.API_URL}/api/ducket/file/${selectedFile}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      if (!response.ok) throw new Error(response.statusText);

      const json = (await response.json()) as { fileDeleted: string; projectId: string };

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

      await MUTATIONS.createActivityLog({
        projectId: projectId,
        userId: userId,
        fileName: selectedFile,
        action: ACTIVITY_ACTIONS.download,
      });

      return { success: 'File downloaded successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Error downloading file' };
    }
  }
);

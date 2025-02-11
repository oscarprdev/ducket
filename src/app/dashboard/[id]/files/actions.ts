'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { ACTIVITY_ACTIONS, VALID_FILE_TYPES } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

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

export const uploadFile = validatedActionWithUser(uploadFileSchema, async (_, formData) => {
  try {
    const apiKey = formData.get('apiKey') as string;
    const projectId = formData.get('projectId') as string;

    const response = await fetch(`${env.API_URL}/api/ducket/file`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error(response.statusText);

    revalidatePath(`/dashboard/${projectId}`);

    return { success: 'File uploaded successfully' };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Error uploading file' };
  }
});

const deleteFileSchema = z.object({
  selectedFile: z.string(),
  apiKey: z.string(),
});

export const deleteFile = validatedActionWithUser(deleteFileSchema, async (data, _) => {
  try {
    const { selectedFile, apiKey } = data;

    const response = await fetch(`${env.API_URL}/api/ducket/file/${selectedFile}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error(response.statusText);

    const json = (await response.json()) as { fileDeleted: string; projectId: string };

    revalidatePath(`/dashboard/${json.projectId}`);

    return { success: 'File deleted successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Error deleting file' };
  }
});

const downloadFileSchema = z.object({
  projectId: z.string(),
  selectedFile: z.string(),
});

export const downloadFile = validatedActionWithUser(downloadFileSchema, async (data, _, user) => {
  try {
    const { selectedFile, projectId } = data;
    const userId = user.id;

    const [project] = await QUERIES.getProjectById({ projectId });
    if (!project) {
      throw new Error('Project not found');
    }

    const [file] = await QUERIES.getFileByName({ projectId, fileName: selectedFile });
    if (!file?.fileName) {
      throw new Error('File not found');
    }

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
});

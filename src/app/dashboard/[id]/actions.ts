'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { VALID_FILE_TYPES } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';

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

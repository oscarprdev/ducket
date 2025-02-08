'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { API_KEY_PERMISSIONS, type ApiKeyPermissions } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

const createApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  email: z.string().email(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const createApiKey = validatedActionWithUser(createApiKeySchema, async data => {
  const { projectId, name, email, read, write, delete: deletePermission } = data;

  let permissions: ApiKeyPermissions[] = [];
  if (read === 'on') {
    permissions.push(API_KEY_PERMISSIONS.read);
  }
  if (write === 'on') {
    permissions.push(API_KEY_PERMISSIONS.write);
  }
  if (deletePermission === 'on') {
    permissions.push(API_KEY_PERMISSIONS.delete);
  }
  if (permissions.length === 3) {
    permissions = [API_KEY_PERMISSIONS.all];
  }
  if (permissions.length === 0) {
    return { error: 'Please select at least one permission' };
  }
  const user = await QUERIES.getUserByEmail({ email });
  if (!user[0]) {
    return { error: 'User not found' };
  }

  const [apiKey] = await QUERIES.getApiKeyByProjectAndUser({ projectId, userId: user[0].id });
  if (apiKey?.userId === user[0].id) {
    return { error: 'User already has an API key for this project' };
  }

  await MUTATIONS.createApiKey({
    projectId,
    name,
    userId: user[0].id,
    permissions,
  });

  return { success: 'API key created successfully' };
});

const deleteApiKeySchema = z.object({
  projectId: z.string(),
  apiKey: z.string(),
});

export const deleteApiKey = validatedActionWithUser(deleteApiKeySchema, async data => {
  try {
    const { projectId, apiKey } = data;

    await MUTATIONS.deleteApiKey({ projectId, apiKey });

    return { success: 'API key deleted successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Error deleting API key' };
  }
});

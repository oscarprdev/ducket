'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { API_KEY_PERMISSIONS, type ApiKeyPermissions } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

const extractPermissions = (read?: string, write?: string, deletePermission?: string) => {
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

  return permissions;
};

const createApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const createApiKey = validatedActionWithUser(createApiKeySchema, async data => {
  const { projectId, name, read, write, delete: deletePermission } = data;
  const permissions = extractPermissions(read, write, deletePermission);
  if (permissions.length === 0) {
    return { error: 'Please select at least one permission' };
  }

  const { apiKeys } = await QUERIES.apiKeys.getByProject({
    projectId,
  });

  const apiKeysPermissions = apiKeys.map(apiKey => apiKey.permissions);

  if (permissions[0] === 'all') {
    return { error: 'Cannot create API key with all permissions' };
  }

  if (
    apiKeysPermissions.some(existingPermissions =>
      existingPermissions.every(permission => permissions.includes(permission as ApiKeyPermissions))
    )
  ) {
    return { error: 'Cannot create another API key with same permissions' };
  }

  await MUTATIONS.createApiKey({
    projectId,
    name,
    permissions,
  });

  revalidatePath(`/dashboard/${projectId}/api-keys`);

  return { success: 'API key created successfully' };
});

const editApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  currentName: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const editApiKey = validatedActionWithUser(editApiKeySchema, async data => {
  const { projectId, name, currentName, read, write, delete: deletePermission } = data;
  const permissions = extractPermissions(read, write, deletePermission);
  if (permissions.length === 0) {
    return { error: 'Please select at least one permission' };
  }

  if (name !== currentName) {
    const { apiKeys: existingKeys } = await QUERIES.apiKeys.getByProject({ projectId });
    if (existingKeys.some(key => key.name === name)) {
      return { error: 'An API key with this name already exists' };
    }
  }

  await MUTATIONS.editApiKey({
    projectId,
    name,
    currentName,
    permissions,
  });

  revalidatePath(`/dashboard/${projectId}/api-keys`);

  return { success: 'API key edited successfully' };
});

const revokeApiKeysSchema = z.object({
  projectId: z.string(),
  selectedKeys: z.array(z.string()),
});

export const revokeApiKeys = validatedActionWithUser(revokeApiKeysSchema, async data => {
  try {
    const { projectId, selectedKeys } = data;

    if (selectedKeys.length === 0) {
      return { error: 'No API keys selected' };
    }

    const apiKeysCount = await QUERIES.apiKeys.getCount({ projectId });

    if (apiKeysCount <= selectedKeys.length) {
      return { error: 'Cannot revoke all API keys. At least one API key must remain active.' };
    }

    await Promise.all(selectedKeys.map(key => MUTATIONS.deleteApiKey({ projectId, apiKey: key })));

    revalidatePath(`/dashboard/${projectId}/api-keys`);
    return { success: 'API keys revoked successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to revoke API keys' };
  }
});

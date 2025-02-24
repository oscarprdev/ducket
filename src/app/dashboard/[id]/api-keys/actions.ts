'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { API_KEY_PERMISSIONS, type ApiKeyPermissions } from '~/lib/constants';
import { extractPermissions } from '~/lib/utils';
import { validatedActionWithPermissions, validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';
import generateApiKey from '~/server/utils/generate-api-key';

const createApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const createApiKey = validatedActionWithUser(createApiKeySchema, async (data, _, user) => {
  const { projectId, name, read, write, delete: deletePermission } = data;
  const permissions = extractPermissions(read, write, deletePermission);
  if (permissions.length === 0) {
    return { error: 'Please select at least one permission' };
  }

  const { apiKeys } = await QUERIES.apiKeys.getByProject({
    projectId,
  });

  const apiKeysPermissions = apiKeys.map(apiKey => apiKey.permissions);

  if (permissions.some(permission => permission === API_KEY_PERMISSIONS.all)) {
    return { error: 'Cannot create API key with all permissions' };
  }

  if (
    apiKeysPermissions.some(existingPermissions =>
      existingPermissions.every(permission => permissions.includes(permission as ApiKeyPermissions))
    )
  ) {
    return { error: 'Cannot create another API key with same permissions' };
  }
  const secret = generateApiKey();
  const newName = `${user.id}/${name}/${secret}`;

  await MUTATIONS.apiKeys.create({
    projectId,
    name: newName,
    permissions,
    secret,
  });

  revalidatePath(`/dashboard/${projectId}/api-keys`);

  return { success: 'API key created successfully' };
});

const editApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  currentName: z.string(),
  apiKey: z.string(),
  read: z.string().optional(),
  write: z.string().optional(),
  delete: z.string().optional(),
});
export const editApiKey = validatedActionWithUser(editApiKeySchema, async (data, _, user) => {
  const { projectId, name, currentName, apiKey, read, write, delete: deletePermission } = data;
  const permissions = extractPermissions(read, write, deletePermission);
  if (permissions.length === 0) {
    return { error: 'Please select at least one permission' };
  }
  const { apiKeys: existingKeys } = await QUERIES.apiKeys.getByProject({ projectId });
  if (name !== currentName) {
    if (existingKeys.some(key => key.name === name)) {
      return { error: 'An API key with this name already exists' };
    }
  }

  if (permissions.includes(API_KEY_PERMISSIONS.all)) {
    return { error: 'Cannot edit API key with all permissions' };
  }

  const newName = `${user.id}/${name}/${apiKey}`;

  await MUTATIONS.apiKeys.edit({
    projectId,
    name: newName,
    currentName,
    permissions,
  });

  revalidatePath(`/dashboard/${projectId}/api-keys`);

  return { success: 'API key edited successfully' };
});

const revokeApiKeysSchema = z.object({
  projectId: z.string(),
  selectedKey: z.string(),
});

export const revokeApiKeys = validatedActionWithPermissions(
  revokeApiKeysSchema,
  [API_KEY_PERMISSIONS.delete, API_KEY_PERMISSIONS.all],
  async data => {
    try {
      const { projectId, selectedKey } = data;
      const [apiKey] = await QUERIES.apiKeys.getBySecret({ apiKey: selectedKey });

      if (apiKey?.permissions.some(key => key.includes(API_KEY_PERMISSIONS.all))) {
        return { error: 'Cannot revoke API key with all permissions' };
      }

      await MUTATIONS.apiKeys.delete({ projectId, apiKey: selectedKey });

      revalidatePath(`/dashboard/${projectId}/api-keys`);
      return { success: 'API keys revoked successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to revoke API keys' };
    }
  }
);

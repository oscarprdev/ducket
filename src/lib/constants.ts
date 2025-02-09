export const VALID_FILE_TYPES = {
  images: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif'],
  files: ['application/pdf', 'application/json'],
  text: ['text/plain', 'text/csv'],
};

export type ApiKeyPermissions = 'read' | 'write' | 'delete' | 'all';
export const API_KEY_PERMISSIONS = {
  read: 'read',
  write: 'write',
  delete: 'delete',
  all: 'all',
} as const as Record<ApiKeyPermissions, ApiKeyPermissions>;

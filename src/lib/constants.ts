import { type ChartConfig } from '~/components/ui/chart';

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

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];
export const ACTIVITY_ACTIONS = {
  upload: 'upload',
  download: 'download',
  delete: 'delete',
  read: 'read',
} as const;

export const chartConfig = {
  upload: {
    label: 'Uploads',
    color: 'hsl(var(--contrast))',
  },
  delete: {
    label: 'Deletes',
    color: 'hsl(var(--destructive))',
  },
  download: {
    label: 'Downloads',
    color: 'hsl(var(--chart-3))',
  },
  read: {
    label: 'Reads',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

import { type ChartConfig } from '~/components/ui/chart';

export const VALID_FILE_TYPES = {
  images: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  files: [
    'application/pdf',
    'application/json',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/vnd.rar',
    'application/x-bzip',
    'application/x-bzip2',
  ],
  text: [
    'text/plain',
    'text/csv',
    'text/html',
    'text/css',
    'text/javascript',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/xml',
    'application/javascript',
  ],
};

export type ApiKeyPermissions = (typeof API_KEY_PERMISSIONS)[keyof typeof API_KEY_PERMISSIONS];
export const API_KEY_PERMISSIONS = {
  read: 'read',
  write: 'write',
  delete: 'delete',
  all: 'all',
} as const;

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];
export const ACTIVITY_ACTIONS = {
  upload: 'upload',
  download: 'download',
  delete: 'delete',
  read: 'read',
} as const;

export type InvitationState = 'pending' | 'accepted' | 'declined';
export const INVITATION_STATES = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
} as const;

export type TransferRequestState = 'pending' | 'accepted' | 'declined';
export const TRANSFER_REQUEST_STATES = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
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
    color: 'hsl(var(--tertiary))',
  },
  read: {
    label: 'Reads',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export interface Permission {
  value: string;
  label: string;
  description: string;
}

export const availablePermissions: Permission[] = [
  { value: 'read', label: 'Read', description: 'Get files and metadata' },
  { value: 'write', label: 'Write', description: 'Upload files' },
  { value: 'delete', label: 'Delete', description: 'Remove files' },
];

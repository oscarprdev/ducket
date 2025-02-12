import { API_KEY_PERMISSIONS, type ApiKeyPermissions } from './constants';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 KB';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const twoDaysInSeconds = 172800; // 48 hours in seconds

  // If more than 2 days, return null to use the standard date format
  if (diffInSeconds >= twoDaysInSeconds) {
    return '';
  }

  const intervals = {
    day: 86400,
    hour: 3600,
    minute: 60,
  } as const;

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const diff = Math.floor(diffInSeconds / secondsInUnit);
    if (diff >= 1) {
      return `${diff} ${unit}${diff === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
}

export function extractPermissions(read?: string, write?: string, deletePermission?: string) {
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
}

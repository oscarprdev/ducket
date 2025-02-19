'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Badge } from '~/components/ui/badge';

export type FileItemBadgePosition = 'left' | 'right';
export type BadgeText = 'Upload' | 'Download' | 'Delete';

export interface FileItemProps {
  index: number;
  title: string;
  size: number;
  uploadedAt: string;
  badgeText: BadgeText;
  itemIcon: ReactNode;
  badgeIcon: ReactNode;
  badgePosition: FileItemBadgePosition;
}

export function FileItem({
  index,
  title,
  size,
  uploadedAt,
  badgeText,
  itemIcon,
  badgeIcon,
  badgePosition,
}: FileItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative flex w-full items-center justify-between gap-2 border border-border bg-muted/90 p-3 sm:p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 20,
          left: badgePosition === 'left' ? -8 : 'auto',
          right: badgePosition === 'right' ? -8 : 'auto',
          top: -8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
          left: badgePosition === 'left' ? -8 : 'auto',
          right: badgePosition === 'right' ? -8 : 'auto',
          top: -8,
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.5 }}
        className="absolute">
        <Badge
          variant={
            badgeText === 'Upload'
              ? 'default'
              : badgeText === 'Download'
                ? 'tertiary'
                : 'destructive'
          }>
          {badgeText}
        </Badge>
      </motion.div>
      <div className="flex w-full items-center justify-between sm:w-auto">
        <div className="flex items-center space-x-4">
          {itemIcon}
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">
              {size}KB • Uploaded {uploadedAt}
            </p>
          </div>
        </div>
      </div>
      <span className="mt-2 flex h-9 items-center rounded-md border border-border px-3 text-muted-foreground hover:text-foreground">
        {badgeIcon}
      </span>
    </motion.div>
  );
}

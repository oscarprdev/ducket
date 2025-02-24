'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

export interface CompressionItemProps {
  index: number;
  title: string;
  size: number;
  uploadedAt: string;
  itemIcon: ReactNode;
  badgeIcon: ReactNode;
}

export function CompressionItem({
  index,
  title,
  size,
  uploadedAt,
  itemIcon,
  badgeIcon,
}: CompressionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative flex w-full items-center justify-between gap-2 border border-border bg-muted/90 p-2 px-4">
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

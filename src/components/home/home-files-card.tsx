'use client';

import { Card } from '../ui/card';
import { type BadgeText, FileItem, type FileItemBadgePosition } from './file-item';
import { CheckIcon, Download, ImageIcon } from 'lucide-react';
import { FileIcon } from 'lucide-react';

export function HomeFilesCard() {
  const filesItems = [
    {
      title: 'Example-file.doc',
      size: 200,
      uploadedAt: '2 min ago',
      badgeText: 'Upload' as BadgeText,
      itemIcon: <FileIcon className="h-4 w-4" />,
      badgeIcon: <Download className="size-4" />,
      badgePosition: 'left' as FileItemBadgePosition,
    },
    {
      title: 'Example-file.png',
      size: 200,
      uploadedAt: '2 min ago',
      badgeText: 'Download' as BadgeText,
      itemIcon: <ImageIcon className="h-4 w-4" />,
      badgeIcon: <Download className="size-4" />,
      badgePosition: 'right' as FileItemBadgePosition,
    },
    {
      title: 'Example-file.txt',
      size: 200,
      uploadedAt: '2 min ago',
      badgeText: 'Delete' as BadgeText,
      itemIcon: <FileIcon className="h-4 w-4" />,
      badgeIcon: <Download className="size-4" />,
      badgePosition: 'left' as FileItemBadgePosition,
    },
  ];
  return (
    <Card className="w-full bg-muted/30 p-4 sm:p-6">
      <section className="flex h-full w-full flex-col-reverse gap-6 md:flex-row md:items-start">
        <div className="flex h-full w-full flex-col gap-3 md:w-1/2">
          {filesItems.map((item, index) => (
            <FileItem key={item.title} index={index} {...item} />
          ))}
        </div>
        <div className="flex h-full w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-xl font-bold sm:text-2xl">Files</h3>
          <p className="text-sm text-muted-foreground">
            With Ducket, you can easily manage your files for everything you need.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              <p className="text-primary/80">Upload files</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              <p className="text-primary/80">Download files</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              <p className="text-primary/80">Delete files</p>
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}

'use client';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { CheckIcon, Download, ImageIcon } from 'lucide-react';
import { FileIcon } from 'lucide-react';

export function HomeFilesCard() {
  return (
    <Card className="w-full bg-muted/30 p-6 px-6">
      <section className="flex h-full w-full items-start gap-6">
        <div className="flex h-full w-1/2 flex-col gap-3">
          {/* Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, left: -8, top: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, left: -8, top: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1 }}
              className="absolute">
              <Badge variant="default">Upload</Badge>
            </motion.div>
            <div className="flex items-center space-x-4">
              <FileIcon className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Example-file.doc</p>
                <p className="text-xs text-muted-foreground">200KB • Uploaded 2 min ago</p>
              </div>
            </div>
            <span className="flex h-9 items-center rounded-md border border-border px-3 text-muted-foreground hover:text-foreground">
              <Download className="size-4" />
            </span>
          </motion.div>
          {/* Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, right: -8, top: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, right: -8, top: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1.5 }}
              className="absolute">
              <Badge variant="tertiary">Download</Badge>
            </motion.div>
            <div className="flex items-center space-x-4">
              <ImageIcon className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Example-file.png</p>
                <p className="text-xs text-muted-foreground">200KB • Uploaded 2 min ago</p>
              </div>
            </div>
            <span className="flex h-9 items-center rounded-md border border-border px-3 text-muted-foreground hover:text-foreground">
              <Download className="size-4" />
            </span>
          </motion.div>
          {/* Item 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, left: -8, top: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, left: -8, top: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 2 }}
              className="absolute">
              <Badge variant="destructive">Delete</Badge>
            </motion.div>
            <div className="flex items-center space-x-4">
              <FileIcon className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Example-file.txt</p>
                <p className="text-xs text-muted-foreground">200KB • Uploaded 2 min ago</p>
              </div>
            </div>
            <span className="flex h-9 items-center rounded-md border border-border px-3 text-muted-foreground hover:text-foreground">
              <Download className="size-4" />
            </span>
          </motion.div>
        </div>
        <div className="flex h-full w-1/2 flex-col gap-2">
          <h3 className="text-2xl font-bold">Files</h3>
          <p className="text-sm text-muted-foreground">
            With Ducket, you can easily manage your files for everything you need.
          </p>
          <div className="mt-3 flex items-center gap-2">
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
      </section>
    </Card>
  );
}

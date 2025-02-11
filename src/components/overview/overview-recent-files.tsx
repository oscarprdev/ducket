import { Button } from '../ui/button';
import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { formatDate, formatFileSize } from '~/lib/utils';
import { type Files } from '~/server/db/schema';

function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />;
    case 'video':
      return <VideoIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
}

export function OverviewRecentFiles({ files }: { files: Files[] }) {
  return (
    <Card className="col-span-2 col-start-3 row-span-4 row-start-3 -mt-7 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Files
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/files">See all files</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="h-full space-y-4 scrollable">
          {files?.length > 0 ? (
            files.map(file => (
              <div key={file.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-md border p-2">{getFileIcon(file.type ?? '')}</div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(file.createdAt)}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No files found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

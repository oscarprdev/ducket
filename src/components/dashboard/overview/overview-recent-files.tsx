import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useFileIcon } from '~/hooks/use-file-icon';
import { formatDate, formatFileSize, formatRelativeTime } from '~/lib/utils';
import { type Files } from '~/server/db/schema';

export function OverviewRecentFiles({ files, projectId }: { files: Files[]; projectId: string }) {
  const { getFileIcon } = useFileIcon();

  return (
    <Card className="col-span-2 col-start-3 row-span-4 row-start-3 -mt-7 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Files
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/${projectId}/files`}>See all files</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="scrollable h-full space-y-4">
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
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(file.createdAt ?? '') || formatDate(file.createdAt ?? '')}
                </p>
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

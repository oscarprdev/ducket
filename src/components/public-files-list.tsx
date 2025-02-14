'use client';

import { Download } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useFileIcon } from '~/hooks/use-file-icon';
import { formatFileSize, formatRelativeTime } from '~/lib/utils';
import { type PublicFiles } from '~/server/db/schema';

export function PublicFilesList({ files }: { files: PublicFiles[] }) {
  const { getFileIcon } = useFileIcon();

  const handleDownload = async (file: PublicFiles) => {
    const response = await fetch(file.fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName ?? '';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="divide-y rounded-lg border">
      {files.length > 0 ? (
        files.map(file => (
          <div key={file.id} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {getFileIcon(file.type ?? '')}
              <div>
                <p className="text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} • Uploaded{' '}
                  {formatRelativeTime(file.createdAt ?? new Date())}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
              <Download className="size-4" />
            </Button>
          </div>
        ))
      ) : (
        <div className="p-4 text-xs text-muted-foreground">No files uploaded yet</div>
      )}
    </div>
  );
}

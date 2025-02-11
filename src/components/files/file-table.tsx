'use client';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import FileDeleteDialog from './file-delete-dialog';
import FileDownloadButton from './file-donwload-button';
import { Check, Copy, File, FileText, Image } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useToast } from '~/hooks/use-toast';
import { formatDate } from '~/lib/utils';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  icon: 'file' | 'image' | 'text';
  createdAt: Date | string;
}

const iconMap = {
  file: File,
  image: Image,
  text: FileText,
};

function CopyUrlButton({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: 'URL Copied',
      description: 'The URL has been copied to your clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" onClick={copyUrl}>
            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy URL</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function FileTable({
  files,
  apiKey,
  isDeleteAllowed,
}: {
  files: FileData[];
  apiKey: string;
  isDeleteAllowed: boolean;
}) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const formatFileSize = useCallback((bytes: string | number) => {
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;

    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  }, []);

  const handleSelectFile = (fileName: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileName) ? prev.filter(name => name !== fileName) : [...prev, fileName]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === files.length ? [] : files.map(file => file.name));
  };

  const handleCleanSelectedFiles = () => setSelectedFiles([]);

  return (
    <>
      {selectedFiles.length > 0 && isDeleteAllowed && (
        <div className="absolute right-48 top-[1.5rem] mb-4 flex justify-end">
          <FileDeleteDialog
            apiKey={apiKey}
            selectedFiles={selectedFiles}
            cleanSelectedFiles={handleCleanSelectedFiles}
          />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {isDeleteAllowed && (
              <TableHead className="w-12">
                <Checkbox
                  checked={files.length > 0 && selectedFiles.length === files.length}
                  onCheckedChange={handleSelectAll}
                  disabled={files.length === 0}
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No files found. Upload some files to get started.
              </TableCell>
            </TableRow>
          ) : (
            files.map(file => {
              const Icon = iconMap[file.icon];
              return (
                <TableRow key={file.id}>
                  {isDeleteAllowed && (
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.name)}
                        onCheckedChange={() => handleSelectFile(file.name)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-light">
                    <div className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-light text-primary">
                    <div className="flex items-center gap-2 space-x-2">
                      <CopyUrlButton url={file.url} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help">
                            {file.url.slice(0, 35)}...
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{file.url}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(file.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <FileDownloadButton fileUrl={file.url} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
}

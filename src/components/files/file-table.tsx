'use client';

import { CopyUrlButton } from '../copy-url-buttont';
import { TablePagination } from '../table-pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import FileDeleteDialog from './file-delete-dialog';
import FileDownloadButton from './file-donwload-button';
import { useRouter } from 'next/navigation';
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
import { formatDate, formatRelativeTime } from '~/lib/utils';

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  icon: 'file' | 'image' | 'text';
  createdAt: Date | string;
}

interface FileTableProps {
  files: FileData[];
  apiKey: string;
  isDeleteAllowed: boolean;
  projectId: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}
export default function FileTable({
  files,
  apiKey,
  isDeleteAllowed,
  projectId,
  totalItems,
  itemsPerPage,
  currentPage,
}: FileTableProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const router = useRouter();
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

  const handleCleanSelectedFiles = (files: string[]) => setSelectedFiles(files);

  const handlePageChange = (page: number) => {
    router.push(`/dashboard/${projectId}/files?page=${page}`, { scroll: false });
  };

  return (
    <>
      {selectedFiles.length > 0 && isDeleteAllowed && (
        <div className="absolute right-40 top-0 mb-4 flex justify-end">
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
                  <TableCell className="max-w-[150px] font-light">{file.name}</TableCell>
                  <TableCell className="max-w-[250px] font-light text-primary">
                    <div className="flex items-center gap-2 space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help truncate">
                            {file.url}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{file.url}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <CopyUrlButton url={file.url} />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(file.createdAt) || formatDate(file.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <FileDownloadButton
                      fileUrl={file.url}
                      projectId={projectId}
                      fileName={file.name}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {totalItems > itemsPerPage && (
        <TablePagination
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

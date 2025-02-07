'use client';

import FileDeleteDialog from './file-delete-dialog';
import FileDownloadButton from './file-donwload-button';
import { File, FileText, Image } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  icon: 'file' | 'image' | 'text';
}

const iconMap = {
  file: File,
  image: Image,
  text: FileText,
};

export default function FileTable({ files, apiKey }: { files: FileData[]; apiKey: string }) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

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
      {selectedFiles.length > 0 && (
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
            <TableHead className="w-12">
              <Checkbox
                checked={files.length > 0 && selectedFiles.length === files.length}
                onCheckedChange={handleSelectAll}
                disabled={files.length === 0}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.includes(file.name)}
                      onCheckedChange={() => handleSelectFile(file.name)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{file.url}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell className="text-right">
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

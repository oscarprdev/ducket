'use client';

import { CopyUrlButton } from '../copy-url-buttont';
import { TablePagination } from '../table-pagination';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ApiKeysEditDialog } from './api-keys-edit-dialog';
import ApiKeysRevokeDialog from './api-keys-revoke-dialog';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { formatDate, formatRelativeTime } from '~/lib/utils';
import { type ApiKeys } from '~/server/db/schema';

interface ApiKeysTableProps {
  projectId: string;
  apiKeys: ApiKeys[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function ApiKeysTable({
  projectId,
  apiKeys,
  totalItems,
  itemsPerPage,
  currentPage,
}: ApiKeysTableProps) {
  const router = useRouter();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectKey = (secret: string) => {
    if (apiKeys.length === 1) return;

    setSelectedKeys(prev =>
      prev.includes(secret) ? prev.filter(key => key !== secret) : [...prev, secret]
    );
  };

  const handleSelectAll = () => {
    if (apiKeys.length === 1) return;

    const allKeys = apiKeys.filter(key => !key.permissions.includes(API_KEY_PERMISSIONS.all));

    setSelectedKeys(selectedKeys.length === allKeys.length ? [] : allKeys.map(key => key.secret));
  };

  const handleCleanSelectedKeys = (keys: string[]) => setSelectedKeys(keys);

  const handlePageChange = (page: number) => {
    router.push(`/dashboard/${projectId}?page=${page}`);
  };

  return (
    <>
      {selectedKeys.length > 0 && apiKeys[0]?.projectId && (
        <div className="absolute right-40 top-[0.65rem] mb-4 flex justify-end">
          <ApiKeysRevokeDialog
            selectedKeys={selectedKeys}
            projectId={projectId}
            cleanSelectedKeys={handleCleanSelectedKeys}
          />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={apiKeys.length > 0 && selectedKeys.length === apiKeys.length}
                onCheckedChange={handleSelectAll}
                disabled={apiKeys.length <= 1}
                className="border-input disabled:border-muted-foreground"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No API keys found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            apiKeys.map(apiKey => (
              <TableRow key={apiKey.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedKeys.includes(apiKey.secret)}
                    onCheckedChange={() => handleSelectKey(apiKey.secret)}
                    disabled={
                      apiKeys.length === 1 || apiKey.permissions.includes(API_KEY_PERMISSIONS.all)
                    }
                    className="border-input disabled:border-muted"
                  />
                </TableCell>
                <TableCell className="font-light">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {showKeys[apiKey.id]
                        ? `${apiKey.secret.slice(0, 5)}...${apiKey.secret.slice(-5)}`
                        : '•••••••••••••'}
                    </code>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}>
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>See API key</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <CopyUrlButton url={apiKey.secret} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {apiKey.permissions.map(permission => (
                      <Badge key={permission}>{permission}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRelativeTime(apiKey.createdAt) || formatDate(apiKey.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {apiKey.lastUsed !== apiKey.createdAt
                    ? formatRelativeTime(apiKey.lastUsed) || formatDate(apiKey.lastUsed)
                    : 'Never'}
                </TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ApiKeysEditDialog apiKey={apiKey}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit API key</span>
                          </Button>
                        </ApiKeysEditDialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit API key</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>{' '}
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

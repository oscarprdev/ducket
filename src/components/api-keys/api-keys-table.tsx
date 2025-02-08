'use client';

import { Button } from '../ui/button';
import ApiKeysActionsDropdown from './api-keys-actions-dropdown';
import { ApiKeysCreateDialog } from './api-keys-create-dialog';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { type ApiKeys } from '~/server/db/schema';

export default function ApiKeysTable({ apiKeys }: { apiKeys: ApiKeys[] }) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your API keys and their permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map(apiKey => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell>{apiKey.userId}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="relative max-w-fit rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {showKeys[apiKey.id]
                        ? `${apiKey.secret.slice(0, 5)}...${apiKey.secret.slice(-5)}`
                        : '•••••••••••••'}
                    </code>
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
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {apiKey.permissions.map(permission => (
                      <span
                        key={permission}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                        {permission}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(apiKey.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {apiKey.lastUsed !== apiKey.createdAt
                    ? new Date(apiKey.lastUsed).toLocaleString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <ApiKeysActionsDropdown apiKey={apiKey} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          {apiKeys[0] && <ApiKeysCreateDialog projectId={apiKeys[0].projectId} />}
        </div>
      </CardContent>
    </Card>
  );
}

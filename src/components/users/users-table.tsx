'use client';

import { CopyUrlButton } from '../copy-url-buttont';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { EditUserDialog } from './edit-user-dialog';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useBadgeVariant } from '~/hooks/use-badge-variant';

export interface UserData {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  confirmed: boolean;
  isOwner: boolean;
}

interface UsersTableProps {
  projectId: string;
  users: UserData[];
  isOwner: boolean;
}
export default function UsersTable({ projectId, users, isOwner }: UsersTableProps) {
  const badgeVariant = useBadgeVariant();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Confirmation</TableHead>
            {isOwner && <TableHead className="text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found. Add some users to get started.
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => {
              return (
                <TableRow key={user.id}>
                  <TableCell className="max-w-[150px] font-light">{user.name}</TableCell>
                  <TableCell className="font-light">{user.isOwner ? 'Admin' : 'Invited'}</TableCell>
                  <TableCell className="max-w-[250px] font-light text-primary">
                    <div className="flex items-center gap-2 space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-help truncate">
                            {user.email}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <CopyUrlButton url={user.email} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.permissions.map(permission => (
                        <Badge key={permission} variant={badgeVariant(permission)}>
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.confirmed ? (
                        <Badge variant={'outline'}>Approved</Badge>
                      ) : (
                        <Badge variant={'tertiary'}>Pending</Badge>
                      )}
                    </div>
                  </TableCell>
                  {isOwner && (
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={handleMenuClick}>
                          <DropdownMenuItem
                            onSelect={e => e.preventDefault()}
                            onClick={() => setIsEditOpen(true)}>
                            Edit permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => e.preventDefault()}
                            onClick={() => setIsDeleteOpen(true)}>
                            Remove from project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                  <EditUserDialog
                    isOpen={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    projectId={projectId}
                    userId={user.id}
                    permissions={user.permissions}
                  />
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
}

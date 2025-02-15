'use client';

import { EditUserDialog } from './edit-user-dialog';
import { RemoveUserDialog } from './remove-user-dialog';
import { MoreHorizontal } from 'lucide-react';
import { CopyUrlButton } from '~/components/dashboard/copy-url-button';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useActivityBadge } from '~/hooks/use-activity-badge';
import { useConfirmationBadge } from '~/hooks/use-confirmation-badge';
import { type InvitationState } from '~/lib/constants';

export interface UserData {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  state: InvitationState;
  isOwner: boolean;
}

interface UsersTableProps {
  projectId: string;
  users: UserData[];
  isOwner: boolean;
  ownerId: string;
}
export default function UsersTable({ projectId, users, isOwner, ownerId }: UsersTableProps) {
  const badgeVariant = useActivityBadge();
  const confirmationBadgeVariant = useConfirmationBadge();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
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
                  <TableCell className="font-light">
                    <Badge variant={'outline'}>{user.isOwner ? 'Admin' : 'Invited'}</Badge>
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
                      <Badge variant={confirmationBadgeVariant(user.state)}>{user.state}</Badge>
                    </div>
                  </TableCell>
                  {isOwner && ownerId !== user.id && (
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <EditUserDialog user={user} projectId={projectId} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <RemoveUserDialog user={user} projectId={projectId} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
}

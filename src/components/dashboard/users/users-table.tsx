'use client';

import { EditUserForm } from './edit-user-form';
import { RemoveUserForm } from './remove-user-form';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { editUserPermissions, removeUser } from '~/app/dashboard/[id]/users/actions';
import { CopyUrlButton } from '~/components/dashboard/copy-url-button';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                              <DialogTrigger asChild>
                                <Button variant="dropdownItem" size={'dropdownItem'}>
                                  Edit permissions
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Project</DialogTitle>
                                  <DialogDescription>
                                    Update your project details.
                                  </DialogDescription>
                                </DialogHeader>
                                <EditUserForm
                                  action={editUserPermissions}
                                  email={user.email}
                                  projectId={projectId}
                                  permissions={user.permissions}>
                                  <Button
                                    type="button"
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                  </Button>
                                </EditUserForm>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                              <DialogTrigger asChild>
                                <Button variant="dropdownItem" size={'dropdownItem'}>
                                  Remove from project
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Remove User</DialogTitle>
                                  <DialogDescription>
                                    Remove {user.name} from the project.
                                  </DialogDescription>
                                </DialogHeader>
                                <RemoveUserForm
                                  action={removeUser}
                                  userId={user.id}
                                  projectId={projectId}>
                                  <Button
                                    type="button"
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                  </Button>
                                </RemoveUserForm>
                              </DialogContent>
                            </Dialog>
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

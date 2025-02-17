'use client';

import { AcceptInvitationDialog } from './accept-invitation-dialog';
import { DeclineInvitationDialog } from './decline-invitation-dialog';
import { MoreHorizontal } from 'lucide-react';
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
import { useConfirmationBadge } from '~/hooks/use-confirmation-badge';
import { INVITATION_STATES } from '~/lib/constants';
import { formatDate, formatRelativeTime } from '~/lib/utils';
import { type ProjectsWithPermissions } from '~/server/db/schema';

interface InvitationsTableProps {
  projects: ProjectsWithPermissions[];
}

export default function InvitationsTable({ projects }: InvitationsTableProps) {
  const confirmationBadgeVariant = useConfirmationBadge();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Your Permissions</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No invitations found.
              </TableCell>
            </TableRow>
          ) : (
            projects?.map(project => (
              <TableRow key={project.id}>
                <TableCell className="max-w-[150px] font-light capitalize">
                  {project.title}
                </TableCell>
                <TableCell className="max-w-[150px] font-light">{project.ownerId}</TableCell>
                <TableCell className="max-w-[150px] space-x-2 font-light">
                  {project.permissions.length === 0 ? (
                    <Badge variant="outline">No permissions</Badge>
                  ) : (
                    project.permissions.map(permission => (
                      <Badge key={permission}>{permission}</Badge>
                    ))
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Badge variant={confirmationBadgeVariant(project.invitationState)}>
                    {project.invitationState}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRelativeTime(project.createdAt) || formatDate(project.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(project.invitationState === INVITATION_STATES.pending ||
                        project.invitationState === INVITATION_STATES.declined) && (
                        <DropdownMenuItem asChild>
                          <AcceptInvitationDialog project={project} />
                        </DropdownMenuItem>
                      )}
                      {(project.invitationState === INVITATION_STATES.accepted ||
                        project.invitationState === INVITATION_STATES.pending) && (
                        <DropdownMenuItem asChild>
                          <DeclineInvitationDialog project={project} />
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

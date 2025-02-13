'use client';

import { DeleteProjectDialog } from '../delete-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';
import { Clock, Folder, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    owner: string;
    lastUpdate: string;
    visibility: 'shared' | 'private';
  };
  usageIcon: React.ReactNode;
  numberOfFiles: React.ReactNode;
  owner: React.ReactNode;
  visibilityIcon: React.ReactNode;
}

export default function ProjectCard({
  project,
  usageIcon,
  numberOfFiles,
  owner,
  visibilityIcon,
}: ProjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Link href={`/dashboard/${project.id}`} key={project.id}>
        <Card className="mb-4 space-y-2 border-2 border-border p-2 transition-colors hover:border-muted-foreground/40">
          <div className="relative rounded-sm border border-border p-2">
            <div className="mb-4 flex items-center space-x-3">
              <Folder className="h-8 w-8 fill-muted text-muted-foreground" />
              <h2 className="text-sm font-semibold capitalize">{project.title}</h2>
            </div>
            <div className="mb-4 flex w-fit flex-col space-y-2">
              {owner}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center space-x-1">
                      <Clock className="h-4 w-4 fill-muted text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{project.lastUpdate}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {numberOfFiles}
            </div>
            {visibilityIcon}
            <div className="absolute right-2 top-2 flex items-center">
              {usageIcon}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 focus:border-none"
                    onClick={handleMenuClick}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={handleMenuClick}>
                  <DropdownMenuItem
                    onSelect={e => e.preventDefault()}
                    onClick={() => setIsEditOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={e => e.preventDefault()}
                    onClick={() => setIsDeleteOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem>Upgrade plan</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </Link>

      <EditProjectDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        projectId={project.id}
        projectTitle={project.title}
      />
      <DeleteProjectDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        projectId={project.id}
      />
    </>
  );
}

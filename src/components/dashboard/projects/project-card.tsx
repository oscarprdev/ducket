'use client';

import { DeleteProjectDialog } from '../delete-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';
import { Clock, Folder, MoreVertical, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Progress } from '~/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { formatFileSize } from '~/lib/utils';
import { type Files, type Users } from '~/server/db/schema';

interface ProjectCardProps {
  id: string;
  title: string;
  owner: Users;
  createdAt: string;
  maxSize: number;
  isOwned: boolean;
  files: Files[];
}

export default function ProjectCard({
  id,
  title,
  owner,
  createdAt,
  maxSize,
  isOwned,
  files,
}: ProjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const usage = files.reduce((acc, file) => acc + file.size, 0);
  const storagePercentage = (usage / maxSize) * 100;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Link href={`/dashboard/${id}`}>
        <Card className="border-px mb-4 space-y-2 border-border p-2 shadow-md">
          <div className="relative rounded-sm p-4 duration-200 hover:bg-muted/50">
            <div className="mb-4 flex flex-col items-start space-y-3">
              <div className="flex items-center space-x-2">
                <Folder className="h-8 w-8 fill-muted text-muted-foreground" />
                <h2 className="text-sm font-semibold capitalize">{title}</h2>
              </div>
              <Badge variant={isOwned ? 'default' : 'outline'}>
                {isOwned ? 'Owned' : 'Invited'}
              </Badge>
            </div>
            <div className="mb-4 flex w-fit flex-col space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center space-x-1">
                      <User className="h-4 w-4 fill-muted text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{owner.name}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Owner</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex w-fit items-center space-x-1">
                      <Clock className="h-4 w-4 fill-muted text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{createdAt}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-xs text-muted-foreground">Storage</span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatFileSize(usage)} / {formatFileSize(maxSize)}
                        </span>
                      </div>
                      <Progress value={storagePercentage} className="h-1" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Storage usage: {storagePercentage.toFixed(2)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="absolute right-2 top-2 flex items-center">
              {isOwned && (
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
              )}
            </div>
          </div>
        </Card>
      </Link>

      <EditProjectDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        projectId={id}
        projectTitle={title}
      />
      <DeleteProjectDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} projectId={id} />
    </>
  );
}

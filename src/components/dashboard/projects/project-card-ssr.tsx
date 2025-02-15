import ProjectCard from './project-card';
import { DatabaseZap, User } from 'lucide-react';
import { FileText } from 'lucide-react';
import { LucideDatabaseZap } from 'lucide-react';
import { Suspense } from 'react';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { TooltipContent } from '~/components/ui/tooltip';
import { TooltipTrigger } from '~/components/ui/tooltip';
import { Tooltip } from '~/components/ui/tooltip';
import { TooltipProvider } from '~/components/ui/tooltip';
import { QUERIES } from '~/server/db/queries';
import { type Projects } from '~/server/db/schema';

async function VisibilityIconSSR({ projectId }: { projectId: string }) {
  const { isShared } = await QUERIES.projectUsers.getVisibility({ projectId });
  return (
    <Badge variant={isShared ? 'outline' : 'default'} className="mt-2 font-medium capitalize">
      {isShared ? 'shared' : 'private'}
    </Badge>
  );
}

async function UsageIconSSR({ projectId }: { projectId: string }) {
  const [[project], allFiles] = await Promise.all([
    QUERIES.projects.getById({ projectId }),
    QUERIES.files.getByProjectId({ projectId }),
  ]);

  if (!project) return null;

  const usage = allFiles.reduce((acc, file) => acc + file.size, 0);
  const isNearLimit = usage + 1000 >= project.maxSize;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="">
          <Badge
            className={`grid h-8 w-8 place-items-center rounded-sm p-0 ${
              isNearLimit
                ? 'bg-red-500/20 text-destructive'
                : 'bg-transparent text-muted-foreground hover:bg-muted'
            }`}>
            <LucideDatabaseZap className="size-4" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{Math.round((usage / project.maxSize) * 100)}% used</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

async function NumberOfFilesSSR({ projectId }: { projectId: string }) {
  const files = await QUERIES.files.getByProjectId({ projectId });
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-fit items-center space-x-1">
            <FileText className="h-4 w-4 fill-muted text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{files.length}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Files uploaded</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

async function ProjectOwnerSSR({ userId }: { userId: string }) {
  const [user] = await QUERIES.users.getById({ id: userId });
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-fit items-center space-x-1">
            <User className="h-4 w-4 fill-muted text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{user?.name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Owner</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export async function ProjectCardSSR({ project }: { project: Projects }) {
  return (
    <ProjectCard
      key={project.id}
      project={{
        id: project.id,
        title: project.title,
        owner: project.ownerId,
        lastUpdate: project.updatedAt.toLocaleDateString('en-GB'),
        visibility: 'private',
      }}
      owner={
        <Suspense
          fallback={
            <div className="flex w-fit items-center space-x-1">
              <User className="h-4 w-4 fill-muted text-muted-foreground" />
              <Skeleton className="h-3 w-12 bg-muted-foreground/50" />
            </div>
          }>
          <ProjectOwnerSSR userId={project.ownerId} />
        </Suspense>
      }
      usageIcon={
        <Suspense
          fallback={
            <Badge
              className={`grid h-8 w-8 place-items-center rounded-sm bg-transparent p-0 text-muted-foreground hover:bg-muted`}>
              <DatabaseZap className="size-4" />
            </Badge>
          }>
          <UsageIconSSR projectId={project.id} />
        </Suspense>
      }
      numberOfFiles={
        <Suspense
          fallback={
            <div className="flex w-fit items-center space-x-1">
              <FileText className="h-4 w-4 fill-muted text-muted-foreground" />
              <Skeleton className="h-3 w-12 bg-muted-foreground/50" />
            </div>
          }>
          <NumberOfFilesSSR projectId={project.id} />
        </Suspense>
      }
      visibilityIcon={
        <Suspense fallback={<Badge className="mt-2 font-medium capitalize">Private</Badge>}>
          <VisibilityIconSSR projectId={project.id} />
        </Suspense>
      }
    />
  );
}

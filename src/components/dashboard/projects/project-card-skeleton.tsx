import { Folder, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ProjectListSkeleton() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-col space-y-2 pb-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-muted p-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </div>
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="rounded-lg p-2">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-2">
              <Skeleton className="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

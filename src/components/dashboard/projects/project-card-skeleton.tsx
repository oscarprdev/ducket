import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ProjectListSkeleton() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-sm" />
              <Skeleton className="h-8 w-8 rounded-sm" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <Skeleton className="h-6 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

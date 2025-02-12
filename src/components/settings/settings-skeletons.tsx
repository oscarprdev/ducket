import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ProjectTitleCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>
          The name of your project as it appears throughout the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TransferProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Project</CardTitle>
        <CardDescription>Transfer this project to another account or organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-40" />
      </CardContent>
    </Card>
  );
}

export function UserAccessCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Access</CardTitle>
        <CardDescription>Manage who has access to this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-9 w-full sm:w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

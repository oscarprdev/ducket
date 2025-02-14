import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function ProjectTitleCardSkeleton() {
  return (
    <Card className="max-w-[800px] border-destructive/20 bg-background">
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>
          The name of your project as it appears throughout the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Button variant="ghost" size="sm" disabled>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransferProjectCardSkeleton() {
  return (
    <Card className="max-w-[800px] border-destructive/20 bg-background">
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

import { Button } from '../ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function OverviewStorageBarSkeleton() {
  return (
    <Card className="col-span-2 max-h-[180px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">STORAGE USED</h3>
              <Button variant="outline" size="sm">
                Upgrade to pro
              </Button>
            </div>

            <div className="flex items-baseline gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <Skeleton className="h-2 w-full" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

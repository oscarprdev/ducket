import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/utils';

export function OverviewUsageChartSkeleton() {
  return (
    <Card className="col-span-2 h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage activity
          <Button variant="outline" size="sm">
            See all activity
          </Button>
        </CardTitle>
        <CardDescription>Last week</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-end justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-16"
              style={{ height: `${Math.floor(Math.random() * 60) + 90}px` }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

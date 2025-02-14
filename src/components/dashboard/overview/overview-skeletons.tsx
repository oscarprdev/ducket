'use client';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function OverviewStorageBarSkeleton() {
  return (
    <Card className="col-span-2 col-start-3 row-span-2">
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

export function OverviewRecentFilesSkeleton() {
  return (
    <Card className="col-span-2 col-start-3 row-span-4 row-start-3 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Files
          <Button variant="outline" size="sm">
            See all files
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="scrollable h-full space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewActivityLogSkeleton() {
  return (
    <Card className="col-span-2 row-span-3 row-start-4 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Activity Log
          <Button variant="outline" size="sm">
            See all logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="scrollable h-full space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewUsageChartSkeleton() {
  return (
    <Card className="col-span-2 row-span-3 h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage activity
          <Button variant="outline" size="sm">
            See all activity
          </Button>
        </CardTitle>
        <CardDescription>Last week</CardDescription>
      </CardHeader>
      <CardContent className="-mt-2">
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

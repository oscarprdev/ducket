import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function OverviewRecentFilesSkeleton() {
  return (
    <Card className="col-span-2 -mt-32 h-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Files
          <Button variant="outline" size="sm">
            See all files
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div>
                  <Skeleton className="mb-2 h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-3 w-[100px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

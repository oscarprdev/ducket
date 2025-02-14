import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

export function ActivityChartSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Usage Activity</h2>
          <div className="space-x-2">
            <Button variant="secondary" size="sm" disabled>
              7d
            </Button>
            <Button variant="ghost" size="sm" disabled>
              30d
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          File uploads, deletes and downloads over the last 30 days
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex h-full w-full items-end justify-between gap-2 pt-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="gap1 flex w-full items-end gap-1">
              <Skeleton
                className="w-8 bg-muted"
                style={{ height: `${Math.random() * 100 + 100}px` }}
              />
              <Skeleton
                className="w-8 bg-muted"
                style={{ height: `${Math.random() * 100 + 100}px` }}
              />
              <Skeleton
                className="w-8 bg-muted"
                style={{ height: `${Math.random() * 100 + 100}px` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityTableSkeleton() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Logs</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }, (_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

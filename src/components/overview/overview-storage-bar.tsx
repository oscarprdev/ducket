import { Button } from '../ui/button';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';

interface OverviewStorageBarProps {
  currentUsage: number; // in bytes
  previousUsage: number; // in bytes
  todayUsage: number; // in bytes
  maxStorage: number; // in bytes
}

export function OverviewStorageBar({
  currentUsage,
  previousUsage,
  todayUsage,
  maxStorage,
}: OverviewStorageBarProps) {
  const currentUsageInMB = (currentUsage / (1024 * 1024)).toFixed(4);
  const maxStorageInMB = (maxStorage / (1024 * 1024)).toFixed(1);

  const totalUsagePercentage = Math.round((currentUsage / maxStorage) * 100);

  // Calculate today's increase percentage against last month's average
  const todayChangePercentage =
    previousUsage > 0 ? ((todayUsage - previousUsage) / previousUsage) * 100 : 0;
  const isTodayIncreased = todayChangePercentage >= 0;

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
              <span className="text-4xl font-bold">{totalUsagePercentage}%</span>
              <span className="text-sm text-muted-foreground">
                {currentUsageInMB}MB OF {maxStorageInMB}MB
              </span>
            </div>
          </div>

          <Progress value={totalUsagePercentage} className="h-2" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 ${isTodayIncreased ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-4 w-4 ${!isTodayIncreased && 'rotate-180'}`} />
                <span>{Math.abs(Math.round(todayChangePercentage))}%</span>
              </div>
              <span className="text-muted-foreground">Compared to yesterday usage</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

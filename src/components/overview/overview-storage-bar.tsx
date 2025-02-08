import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';

interface OverviewStorageBarProps {
  currentUsage: number; // in bytes
  maxStorage: number; // in bytes
  previousUsage: number; // in bytes
}

export function OverviewStorageBar({
  currentUsage,
  maxStorage,
  previousUsage,
}: OverviewStorageBarProps) {
  // Convert bytes to MB for display
  const usageInMB = (currentUsage / (1024 * 1024)).toFixed(1);
  const maxStorageInMB = (maxStorage / (1024 * 1024)).toFixed(1);

  // Calculate percentage
  const percentage = Math.round((currentUsage / maxStorage) * 100);

  // Calculate comparison with previous period
  const usageChange = ((currentUsage - previousUsage) / previousUsage) * 100;
  const isIncreased = usageChange > 0;

  return (
    <Card className="col-span-2 max-h-[180px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">STORAGE USED</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{percentage}%</span>
              <span className="text-sm text-muted-foreground">
                {usageInMB} OF {maxStorageInMB}MB
              </span>
            </div>
          </div>

          <Progress value={percentage} className="h-2" />

          <div className="flex items-center gap-2 text-sm">
            <div
              className={`flex items-center gap-1 ${isIncreased ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 ${!isIncreased && 'rotate-180'}`} />
              <span>{Math.abs(Math.round(usageChange))}%</span>
            </div>
            <span className="text-muted-foreground">Compared to the previous 30 day period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

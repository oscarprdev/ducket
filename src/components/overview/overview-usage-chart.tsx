'use client';

import { Button } from '../ui/button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { useDateRange } from '~/hooks/use-date-range';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { type ActivityLogs } from '~/server/db/schema';

const chartConfig = {
  uploads: {
    label: 'Uploads',
    color: 'hsl(var(--contrast))',
  },
  deletes: {
    label: 'Deletes',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

interface OverviewUsageChartProps {
  activityLogs: ActivityLogs[];
}

const groupLogsByDay = (files: ActivityLogs[]) => {
  return files.reduce(
    (acc, file) => {
      if (!file.timestamp) return acc;
      const fileDate = new Date(file.timestamp);
      const dayName = fileDate.toLocaleDateString('en-US', { weekday: 'long' });

      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push(file.id);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

export function OverviewUsageChart({ activityLogs }: OverviewUsageChartProps) {
  const dateRange = useDateRange({ type: '7d' });

  const { groupedUploads, groupedDeletes } = useMemo(() => {
    const uploads = activityLogs.filter(log => log.action === API_KEY_PERMISSIONS.write);
    const deletes = activityLogs.filter(log => log.action === API_KEY_PERMISSIONS.delete);

    return {
      groupedUploads: groupLogsByDay(uploads),
      groupedDeletes: groupLogsByDay(deletes),
    };
  }, [activityLogs]);

  const chartData = useMemo(() => {
    return dateRange.map(({ date, display }) => {
      const actualDay =
        display === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'long' }) : display;

      return {
        day: display,
        uploads: groupedUploads[actualDay]?.length ?? 0,
        deletes: groupedDeletes[actualDay]?.length ?? 0,
      };
    });
  }, [dateRange, groupedUploads, groupedDeletes]);

  const { totalUploads, totalDeletes } = useMemo(() => {
    return {
      totalUploads: Object.values(groupedUploads).reduce((acc, files) => acc + files.length, 0),
      totalDeletes: Object.values(groupedDeletes).reduce((acc, files) => acc + files.length, 0),
    };
  }, [groupedUploads, groupedDeletes]);

  const tickFormatter = useMemo(
    () => (value: string) => (value !== 'Today' ? value.slice(0, 3) : value),
    []
  );

  return (
    <Card className="col-span-2 row-span-3 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage activity
          <Button variant="outline" size="sm">
            See all activity
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 pb-2">
        <div className="h-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={tickFormatter}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="uploads"
                opacity={0.8}
                fill="var(--color-uploads)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="deletes"
                opacity={0.8}
                fill="var(--color-deletes)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totalUploads + totalDeletes > 0 ? (
            <>
              {totalUploads} uploads, {totalDeletes} deletes this week{' '}
              {totalUploads > totalDeletes ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </>
          ) : (
            'No activity this week'
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing file activity for the last week
        </div>
      </CardFooter>
    </Card>
  );
}

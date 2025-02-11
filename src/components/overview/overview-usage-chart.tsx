'use client';

import { Button } from '../ui/button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { type ActivityLogs } from '~/server/db/schema';

const chartConfig = {
  uploads: {
    label: 'Uploads',
    color: '#2563eb',
  },
  deletes: {
    label: 'Deletes',
    color: '#dc2626',
  },
} satisfies ChartConfig;

interface OverviewUsageChartProps {
  activityLogs: ActivityLogs[];
}

const groupFilesByDay = (files: ActivityLogs[]) => {
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
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      days.push(dayName === today ? 'Today' : dayName);
    }
    return days;
  }, []);

  const { groupedUploads, groupedDeletes } = useMemo(() => {
    const uploads = activityLogs.filter(log => log.action === API_KEY_PERMISSIONS.write);
    const deletes = activityLogs.filter(log => log.action === API_KEY_PERMISSIONS.delete);

    return {
      groupedUploads: groupFilesByDay(uploads),
      groupedDeletes: groupFilesByDay(deletes),
    };
  }, [activityLogs]);

  const chartData = useMemo(() => {
    return last7Days.map(day => {
      const actualDay =
        day === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'long' }) : day;

      return {
        day,
        uploads: groupedUploads[actualDay]?.length ?? 0,
        deletes: groupedDeletes[actualDay]?.length ?? 0,
      };
    });
  }, [last7Days, groupedUploads, groupedDeletes]);

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
    <Card className="col-span-2 row-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage activity
          <Button variant="outline" size="sm">
            See all activity
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[150px]">
        <ChartContainer config={chartConfig} className="h-full max-h-[150px] w-full">
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 py-3 text-sm">
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

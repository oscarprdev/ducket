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
import { type Files } from '~/server/db/schema';

const chartConfig = {
  files: {
    label: 'files',
    color: '#2563eb',
  },
} satisfies ChartConfig;

interface OverviewUsageChartProps {
  weeklyData: Files[];
  todayUsage: Files[];
}

const groupFilesByDay = (files: Files[]) => {
  return files.reduce(
    (acc, file) => {
      if (!file.createdAt) return acc;
      const fileDate = new Date(file.createdAt);
      const dayName = fileDate.toLocaleDateString('en-US', { weekday: 'long' });

      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push(file);
      return acc;
    },
    {} as Record<string, Files[]>
  );
};

export function OverviewUsageChart({ weeklyData, todayUsage }: OverviewUsageChartProps) {
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

  const { groupedWeeklyFiles, groupedTodayFiles } = useMemo(
    () => ({
      groupedWeeklyFiles: groupFilesByDay(weeklyData),
      groupedTodayFiles: groupFilesByDay(todayUsage),
    }),
    [weeklyData, todayUsage]
  );

  const chartData = useMemo(() => {
    return last7Days.map(day => ({
      day,
      files:
        day === 'Today'
          ? (groupedTodayFiles[new Date().toLocaleDateString('en-US', { weekday: 'long' })]
              ?.length ?? 0)
          : (groupedWeeklyFiles[day]?.length ?? 0),
    }));
  }, [last7Days, groupedWeeklyFiles, groupedTodayFiles]);

  const { totalFiles, hasTrend } = useMemo(() => {
    const totalWeeklyFiles = Object.values(groupedWeeklyFiles).reduce(
      (acc, files) => acc + files.length,
      0
    );
    const totalTodayFiles = Object.values(groupedTodayFiles).reduce(
      (acc, files) => acc + files.length,
      0
    );
    return {
      totalFiles: totalWeeklyFiles + totalTodayFiles,
      hasTrend: totalWeeklyFiles + totalTodayFiles > 0,
    };
  }, [groupedWeeklyFiles, groupedTodayFiles]);

  const tickFormatter = useMemo(
    () => (value: string) => (value !== 'Today' ? value.slice(0, 3) : value),
    []
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage activity
          <Button variant="outline" size="sm">
            See all activity
          </Button>
        </CardTitle>
        <CardDescription>Last week</CardDescription>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="files" fill="var(--color-files)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totalFiles > 0 ? (
            <>
              {totalFiles} files uploaded this week{' '}
              {hasTrend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </>
          ) : (
            'No files uploaded this week'
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing files uploaded for the last week
        </div>
      </CardFooter>
    </Card>
  );
}

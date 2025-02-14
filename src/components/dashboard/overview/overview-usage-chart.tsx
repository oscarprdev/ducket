'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { useActivityChart } from '~/hooks/use-activity-chart';
import { chartConfig } from '~/lib/constants';
import { type ActivityLogs } from '~/server/db/schema';

interface OverviewUsageChartProps {
  activityLogs: ActivityLogs[];
  projectId: string;
}

export function OverviewUsageChart({ activityLogs, projectId }: OverviewUsageChartProps) {
  const { chartData, totals } = useActivityChart({ type: '7d', activityLogs });

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
            <Link href={`/dashboard/${projectId}/activity`}>See all activity</Link>
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
                dataKey="upload"
                opacity={0.8}
                fill="var(--color-upload)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="delete"
                opacity={0.8}
                fill="var(--color-delete)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="download"
                opacity={0.8}
                fill="var(--color-download)"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="read" opacity={0.8} fill="var(--color-read)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totals.uploads + totals.deletes + totals.downloads > 0 ? (
            <>
              {totals.uploads} uploads, {totals.deletes} deletes, {totals.downloads} downloads this
              week{' '}
              {totals.uploads > totals.deletes ? (
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

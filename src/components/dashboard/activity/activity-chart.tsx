'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { useActivityChart } from '~/hooks/use-activity-chart';
import { chartConfig } from '~/lib/constants';
import { type ActivityLogs } from '~/server/db/schema';

const PERIODS = ['7d', '30d'] as const;

interface ActivityChartProps {
  activityLogs: ActivityLogs[];
}

export function ActivityChart({ activityLogs }: ActivityChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[1]);
  const { chartData } = useActivityChart({
    type: selectedPeriod,
    activityLogs,
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage Activity</CardTitle>
          <div className="space-x-2">
            {PERIODS.map(period => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}>
                {period}
              </Button>
            ))}
          </div>
        </div>
        <CardDescription>
          File uploads, deletes, reads and downloads over the{' '}
          {selectedPeriod === PERIODS[0] ? 'last 7 days' : 'last 30 days'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={selectedPeriod === PERIODS[0] ? 0 : 2}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="download"
                fill="var(--color-download)"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="upload"
                fill="var(--color-upload)"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="delete"
                fill="var(--color-delete)"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="read" fill="var(--color-read)" opacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

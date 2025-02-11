'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { useDateRange } from '~/hooks/use-date-range';

const chartConfig = {
  write: {
    label: 'Uploads',
    color: 'hsl(var(--contrast))',
  },
  read: {
    label: 'Downloads',
    color: 'hsl(var(--chart-2))',
  },
  delete: {
    label: 'Deletes',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

interface ActivityChartProps {
  data: Record<string, { write: number; delete: number; read: number }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const dateRange = useDateRange({ type: '30d' });

  const chartData = useMemo(() => {
    return dateRange.map(({ date, display, fullDate }) => {
      if (!date) return null;

      const counts = data[date] ?? { write: 0, read: 0, delete: 0 };

      return {
        date: display,
        write: counts.write,
        read: counts.read,
        delete: counts.delete,
        fullDate,
      };
    });
  }, [data, dateRange]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage Activity</CardTitle>
        </div>
        <CardDescription>File uploads, deletes and downloads over the last month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => {
                  return value === 'Today' ? 'Today' : value;
                }}
                interval={2}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="read" fill="var(--color-read)" opacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar dataKey="write" fill="var(--color-write)" opacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="delete"
                fill="var(--color-delete)"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

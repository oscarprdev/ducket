'use client';

import { TrendingUp } from 'lucide-react';
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

const chartData = [
  { month: 'January', files: 186 },
  { month: 'February', files: 305 },
  { month: 'March', files: 237 },
  { month: 'April', files: 73 },
  { month: 'May', files: 209 },
  { month: 'June', files: 214 },
];

const chartConfig = {
  files: {
    label: 'files',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export function OverviewUsageChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Usage activity</CardTitle>
        <CardDescription>Last week</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[150px]">
        <ChartContainer config={chartConfig} className="h-full max-h-[150px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="files" fill="var(--color-files)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

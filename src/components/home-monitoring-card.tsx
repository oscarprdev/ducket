'use client';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { motion } from 'framer-motion';
import { DownloadIcon, Trash, UploadIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';
import { chartConfig } from '~/lib/constants';

const mockData = [
  { date: 'Mon', upload: 4, download: 3, delete: 1, read: 5 },
  { date: 'Tue', upload: 3, download: 4, delete: 2, read: 3 },
  { date: 'Wed', upload: 5, download: 2, delete: 1, read: 4 },
  { date: 'Thu', upload: 2, download: 5, delete: 3, read: 2 },
  { date: 'Fri', upload: 4, download: 3, delete: 2, read: 5 },
  { date: 'Sat', upload: 3, download: 4, delete: 1, read: 3 },
  { date: 'Sun', upload: 5, download: 2, delete: 2, read: 4 },
];

export function HomeMonitoringCard() {
  return (
    <Card className="w-full bg-muted/30 p-6 px-6">
      <section className="flex h-full w-full flex-col items-start gap-6">
        <div className="flex h-full w-full flex-col gap-2">
          <h3 className="text-2xl font-bold">Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Everything on your project is monitored and logged. You can see the activity of your
            project in real time.
          </p>
        </div>
        <div className="flex h-full w-full gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1 }}
            className="relative h-[200px] w-1/2">
            <ChartContainer config={chartConfig} className="relative h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="download"
                    className="fill-muted-foreground"
                    fill="orange"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="upload"
                    className="fill-primary/90"
                    fill="blue"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="delete"
                    className="fill-muted-foreground/40"
                    fill="red"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="read"
                    className="fill-primary/80"
                    fill="green"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
          <div className="flex h-full w-1/2 flex-col gap-3">
            {/* Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
              <div className="flex items-center space-x-4">
                <DownloadIcon className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Example-document.pdf</p>
                  <p className="text-xs text-muted-foreground">2 min ago • John Doe</p>
                </div>
              </div>
              <Badge variant="tertiary">Download</Badge>
            </motion.div>
            {/* Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
              <div className="flex items-center space-x-4">
                <UploadIcon className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Example-file.txt</p>
                  <p className="text-xs text-muted-foreground">10 min ago • John Doe</p>
                </div>
              </div>
              <Badge variant="default">Upload</Badge>
            </motion.div>
            {/* Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              className="relative flex w-full items-center justify-between gap-5 border border-border bg-muted/90 p-4">
              <div className="flex items-center space-x-4">
                <Trash className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Example-image.png</p>
                  <p className="text-xs text-muted-foreground">Yesterday • John Doe</p>
                </div>
              </div>
              <Badge variant="destructive">Delete</Badge>
            </motion.div>
          </div>
        </div>
      </section>
    </Card>
  );
}

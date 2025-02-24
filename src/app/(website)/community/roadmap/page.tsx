import { ArrowRight, Check, FileIcon, ImageIcon, ScissorsLineDashed, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import {
  CompressionItem,
  type CompressionItemProps,
} from '~/components/website/community/roadmap-file-item';
import { Timeline } from '~/components/website/community/timeline';
import { PricingCards, type PricingTier } from '~/components/website/pricing-carts';

const compressionFiles: CompressionItemProps[] = [
  {
    index: 0,
    title: 'Example-file.doc',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <FileIcon className="h-4 w-4" />,
    badgeIcon: <ScissorsLineDashed className="size-4" />,
  },
  {
    index: 1,
    title: 'Example-image.png',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <ImageIcon className="h-4 w-4" />,
    badgeIcon: <ScissorsLineDashed className="size-4" />,
  },
  {
    index: 2,
    title: 'Example-file.txt',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <FileIcon className="h-4 w-4" />,
    badgeIcon: <ScissorsLineDashed className="size-4" />,
  },
];

const summarizeFiles: CompressionItemProps[] = [
  {
    index: 0,
    title: 'Example-file.doc',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <FileIcon className="h-4 w-4" />,
    badgeIcon: <Sparkles className="size-4" />,
  },
  {
    index: 1,
    title: 'Example-file.pdf',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <FileIcon className="h-4 w-4" />,
    badgeIcon: <Sparkles className="size-4" />,
  },
  {
    index: 2,
    title: 'Example-file.txt',
    size: 200,
    uploadedAt: '2 min ago',
    itemIcon: <FileIcon className="h-4 w-4" />,
    badgeIcon: <Sparkles className="size-4" />,
  },
];

const tiers: PricingTier[] = [
  {
    name: 'Hobby',
    price: 0,
    description: 'For personal use',
    features: [
      { name: 'Up to 2 projects', included: true },
      { name: '5MB max file size', included: true, highlight: true },
      { name: 'Up to 1GB shared storage', included: true, highlight: true },
      { name: 'Analytics up to 7 days', included: true, highlight: true },
      { name: 'Multiple users', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Better storage size', included: false },
      { name: 'File compression', included: false },
      { name: 'Text summarization', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 14.99,
    interval: 'monthly',
    description: 'For professional use',
    highlight: true,
    features: [
      { name: 'Up to 10 projects', included: true },
      { name: '25MB max file size', included: true, highlight: true },
      { name: 'Up to 1GB for each project', included: true, highlight: true },
      { name: 'Analytics up to 30 days', included: true, highlight: true },
      { name: 'Multiple users', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Better storage size', included: true },
      { name: 'File compression', included: true },
      { name: 'Text summarization', included: true },
    ],
  },
];

export default function RoadmapPage() {
  const data = [
    {
      title: 'Image compression',
      content: (
        <section className="flex flex-col gap-4">
          <p className="text-md font-normal">
            Compress images to reduce file size and improve performance.
          </p>
          <ul className="ml-2 list-disc text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Ducket will reduce file size and maintain high quality.</p>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Smaller images mean faster load times.</p>
            </li>
          </ul>
          <div className="relative flex w-full max-w-[600px] flex-col gap-2">
            <Badge className="absolute -top-8 right-0">Compress images!</Badge>
            {compressionFiles.map(item => (
              <CompressionItem key={item.index} {...item} />
            ))}
          </div>
        </section>
      ),
    },
    {
      title: 'Summarize text files',
      content: (
        <section className="flex flex-col gap-4">
          <p className="text-md font-normal">
            Utilize AI to summarize text files and extract key insights.
          </p>
          <ul className="ml-2 list-disc text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Ducket can efficiently summarize text files, providing concise overviews.</p>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Quickly grasp the essential points of a document.</p>
            </li>
          </ul>
          <div className="relative flex w-full max-w-[600px] flex-col gap-2">
            <Badge variant={'tertiary'} className="absolute -top-8 right-0">
              Summarize Text Files!
            </Badge>
            {summarizeFiles.map(item => (
              <CompressionItem key={item.index} {...item} />
            ))}
          </div>
        </section>
      ),
    },
    {
      title: 'Expanded Maximum Size Limits',
      content: (
        <section className="flex flex-col gap-4">
          <p className="text-md font-normal">
            Increase the maximum size limits for files and images.
          </p>
          <ul className="ml-2 list-disc text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Ducket will handle larger files and images.</p>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p>Increasing x5 the max file size.</p>
            </li>
          </ul>
          <div className="relative flex w-full max-w-[600px] items-center gap-2">
            <Card className="flex h-[200px] w-[200px] flex-col items-center justify-center">
              <p className="text-2xl font-bold">5MB</p>
              <p className="text-sm text-muted-foreground">Max file size</p>
            </Card>
            <ArrowRight className="size-4 text-muted-foreground" />
            <Card className="flex h-[200px] w-[200px] flex-col items-center justify-center">
              <p className="text-2xl font-bold">25MB</p>
              <p className="text-sm text-muted-foreground">Max file size</p>
            </Card>
          </div>
        </section>
      ),
    },
    {
      title: 'Pro Account',
      content: (
        <section className="flex flex-col gap-4">
          <p className="text-md font-normal">
            All features are free during beta. Pro account will unlock more features in the future.
          </p>
          <div className="relative flex w-full max-w-[800px] items-center gap-2">
            <PricingCards tiers={tiers} />
          </div>
        </section>
      ),
    },
  ];
  return (
    <section className="relative h-full min-h-screen w-full">
      <Timeline data={data} />
      <section className="relative mx-auto mt-10 h-full max-w-[1000px] space-y-8 px-4 py-28">
        <Card className="space-y-4 py-10">
          <CardHeader>
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Missing features?</h2>
              <p className="mt-5 text-sm text-muted-foreground sm:text-base">
                Check community proposals, add your own and vote for your favorite features.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/community/proposals">Propose a feature</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

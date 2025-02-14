import Link from 'next/link';
import { type PropsWithChildren } from 'react';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

export function ShimmerBadge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <Link href="/last-updates">
      <Badge
        variant="default"
        className={cn('flex w-fit items-center gap-1 hover:bg-secondary/80', className)}>
        {children}
      </Badge>
    </Link>
  );
}

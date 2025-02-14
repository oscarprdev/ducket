import Link from 'next/link';
import { type PropsWithChildren } from 'react';
import { Badge } from '~/components/ui/badge';

export function ShimmerBadge({ children }: PropsWithChildren) {
  return (
    <Link href="/last-updates">
      <Badge variant="default" className="flex w-fit items-center gap-1 hover:bg-secondary/80">
        {children}
      </Badge>
    </Link>
  );
}

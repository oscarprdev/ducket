import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex capitalize items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent-foreground text-accent',
        secondary: 'border-transparent bg-contrast-foreground text-contrast',
        destructive: 'bg-destructive/10 text-destructive border border-transparent',
        outline: 'text-foreground bg-muted-foreground/30',
        tertiary: 'border-transparent bg-tertiary-foreground text-tertiary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

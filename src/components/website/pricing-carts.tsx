'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export interface PricingFeature {
  name: string;
  highlight?: boolean;
  included: boolean;
}

export interface PricingTier {
  name: string;
  price: number;
  interval?: string;
  description: string;
  features: PricingFeature[];
  highlight?: boolean;
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export interface PricingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers: PricingTier[];
  containerClassName?: string;
  cardClassName?: string;
  sectionClassName?: string;
}

export function PricingCards({
  tiers,
  className,
  containerClassName,
  cardClassName,
  sectionClassName,
  ...props
}: PricingCardsProps) {
  return (
    <section
      className={cn(
        'bg-background text-foreground',
        'p-4',
        'fade-bottom overflow-hidden pb-0',
        sectionClassName
      )}>
      <div className={cn('mx-auto w-full', containerClassName)} {...props}>
        <div className={cn('grid grid-cols-1 gap-8 md:grid-cols-2', className)}>
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={cn(
                'group relative',
                'rounded-2xl transition-all duration-500',
                tier.highlight
                  ? 'bg-gradient-to-b from-neutral-950 to-neutral-900 dark:from-neutral-900 dark:to-neutral-950'
                  : 'bg-white dark:bg-neutral-900',
                'border border-neutral-200 dark:border-neutral-800',
                'hover:border-neutral-300 dark:hover:border-neutral-700',
                'hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]',
                cardClassName
              )}>
              <div className="flex h-full flex-col p-10">
                <div className="space-y-4">
                  <h3
                    className={cn(
                      'text-lg font-medium uppercase tracking-wider',
                      tier.highlight ? 'text-white' : 'text-neutral-900 dark:text-white'
                    )}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        'text-5xl font-light',
                        tier.highlight ? 'text-white' : 'text-neutral-900 dark:text-white'
                      )}>
                      ${tier.price}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        tier.highlight
                          ? 'text-neutral-400'
                          : 'text-neutral-500 dark:text-neutral-400'
                      )}>
                      {tier.interval ?? 'one-time'}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'border-b pb-6 text-sm',
                      tier.highlight
                        ? 'border-neutral-800 text-neutral-400'
                        : 'border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400'
                    )}>
                    {tier.description}
                  </p>
                </div>

                <div className="mt-8 flex-grow space-y-4">
                  {tier.features.map(feature => (
                    <div key={feature.name} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                          feature.included
                            ? tier.highlight
                              ? 'text-white'
                              : 'text-neutral-900 dark:text-white'
                            : 'text-neutral-300 dark:text-neutral-700'
                        )}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={cn(
                          'text-sm',
                          tier.highlight
                            ? 'text-neutral-300'
                            : 'text-neutral-600 dark:text-neutral-300'
                        )}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {tier.cta && (
                  <div className="mt-8">
                    <Button
                      className={cn(
                        'group relative h-12 w-full',
                        tier.highlight
                          ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100',
                        'transition-all duration-300'
                      )}
                      onClick={tier.cta.onClick}
                      asChild={Boolean(tier.cta.href)}>
                      {tier.cta.href ? (
                        <Link href={tier.cta.href}>
                          <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
                            {tier.cta.text}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
                          {tier.cta.text}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

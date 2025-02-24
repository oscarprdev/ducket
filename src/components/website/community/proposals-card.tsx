'use client';

import { ProposalLikeForm } from './proposal-like-form';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import { cn, formatRelativeTime } from '~/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  userImage?: string;
  isLiked?: boolean;
  likesCount?: number;
  canLike?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex h-full flex-col justify-between p-2', className)} {...props}>
      {props.children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

const ProposalsCard = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      id,
      title,
      description,
      createdAt,
      userImage,
      isLiked,
      likesCount,
      canLike,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          className,
          'relative h-40 w-full rounded-sm border-[0.5px] p-2',
          'border-zinc-300 dark:border-zinc-800'
        )}
        {...props}>
        <div className="h-full w-full rounded-sm border border-zinc-300 bg-gradient-to-br from-white to-zinc-200/60 p-2 shadow-[2px_0_8px_rgba(0,_0,_0,_0.15)] dark:border-zinc-900/50 dark:from-zinc-950 dark:to-zinc-900/60 dark:shadow-inner">
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt="User"
                      className="h-full w-full object-cover"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs text-primary">
                      U
                    </div>
                  )}
                </div>
                {title && (
                  <h3 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                )}
              </div>
              {description && (
                <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>

            <div className="-mb-3 mt-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {createdAt && formatRelativeTime(createdAt)}
              </span>
              <ProposalLikeForm
                proposalId={id}
                isLiked={isLiked}
                likesCount={likesCount}
                canLike={canLike}
              />
            </div>
          </CardContent>
        </div>
      </div>
    );
  }
);
ProposalsCard.displayName = 'ProposalsCard';

const ProposalsCardSkeleton = () => {
  return (
    <div className="h-40 w-full rounded-sm border-[0.5px] border-zinc-300 p-2 dark:border-zinc-800">
      <div className="flex h-full w-full flex-col gap-2 rounded-sm border border-zinc-300 bg-gradient-to-br from-white to-zinc-200/60 p-2 shadow-[2px_0_8px_rgba(0,_0,_0,_0.15)] dark:border-zinc-900/50 dark:from-zinc-950 dark:to-zinc-900/60 dark:shadow-inner">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-full w-full" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/5" />
        </div>
      </div>
    </div>
  );
};

export { ProposalsCard, CardContent, ProposalsCardSkeleton };

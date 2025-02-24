'use client';

import { ThumbsUp } from 'lucide-react';
import { toggleLike } from '~/app/(website)/community/proposals/actions';
import { Button } from '~/components/ui/button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { cn } from '~/lib/utils';

interface ProposalLikeFormProps {
  proposalId: string;
  isLiked?: boolean;
  likesCount?: number;
  canLike?: boolean;
}

export function ProposalLikeForm({
  proposalId,
  isLiked,
  likesCount,
  canLike,
}: ProposalLikeFormProps) {
  const { toast } = useToast();
  const { formAction, pending } = useFormAction({
    action: toggleLike,
    onSuccess: data => {
      toast({
        title: data,
        variant: 'success',
      });
    },
  });

  const handleLikeAction = async () => {
    if (!canLike) return;
    const formData = new FormData();
    formData.append('proposalId', proposalId);
    formAction(formData);
  };

  return (
    <form action={handleLikeAction} className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{likesCount ?? 0}</span>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8')}
        disabled={!canLike || pending}>
        <ThumbsUp className={cn('h-4 w-4', isLiked && 'fill-accent-foreground/50 text-accent')} />
      </Button>
    </form>
  );
}

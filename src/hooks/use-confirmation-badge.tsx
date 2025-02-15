import { useCallback } from 'react';
import { INVITATION_STATES } from '~/lib/constants';

export const useConfirmationBadge = () => {
  const badgeVariant = useCallback((action: string) => {
    switch (action) {
      case INVITATION_STATES.pending:
        return 'tertiary';
      case INVITATION_STATES.declined:
        return 'destructive';
      case INVITATION_STATES.accepted:
        return 'default';
      default:
        return 'default';
    }
  }, []);

  return badgeVariant;
};

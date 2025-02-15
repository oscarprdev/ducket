import { useCallback } from 'react';
import { ACTIVITY_ACTIONS } from '~/lib/constants';

export const useActivityBadge = () => {
  const badgeVariant = useCallback((action: string) => {
    switch (action) {
      case ACTIVITY_ACTIONS.upload:
        return 'secondary';
      case ACTIVITY_ACTIONS.download:
        return 'tertiary';
      case ACTIVITY_ACTIONS.delete:
        return 'destructive';
      case ACTIVITY_ACTIONS.read:
        return 'default';
      default:
        return 'default';
    }
  }, []);

  return badgeVariant;
};

import { useActionState, useEffect } from 'react';
import { type ActionState } from '~/server/auth/middleware';

export const useFormAction = ({
  action,
  onSuccess,
  onError,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onSuccess?: (message?: string) => void;
  onError?: (message?: string) => void;
}) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { error: '' });

  useEffect(() => {
    if (state?.success) {
      onSuccess?.(state?.success);
    } else if (state?.error) {
      onError?.(state?.error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, state?.success, state?.error]);

  return { state, formAction, pending };
};

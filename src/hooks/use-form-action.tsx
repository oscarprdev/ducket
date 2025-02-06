import { useActionState, useEffect } from 'react';
import { type ActionState } from '~/server/auth/middleware';

export const useFormAction = ({
  action,
  onSuccess,
  onError,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { error: '' });

  useEffect(() => {
    if (state?.success) {
      onSuccess?.();
    } else if (state?.error) {
      onError?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success, state?.error]);

  return { state, formAction, pending };
};

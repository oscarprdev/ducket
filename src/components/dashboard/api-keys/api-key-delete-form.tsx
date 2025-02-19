import SubmitButton from '../../shared/submit-button';
import { redirect } from 'next/navigation';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface ApiKeyDeleteFormProps {
  projectId: string;
  apiKey: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export function ApiKeyDeleteForm({
  projectId,
  apiKey,
  action,
  onActionFinished,
}: ApiKeyDeleteFormProps) {
  const { toast } = useToast();
  const { formAction, pending } = useFormAction({
    action,
    onSuccess: (message?: string) => {
      toast({
        title: 'API key deleted',
        description: message ?? 'Your API key has been deleted successfully',
      });

      setTimeout(() => {
        onActionFinished?.();
        redirect(`/dashboard/${projectId}/api-keys`);
      }, 100);
    },
    onError: (message?: string) => {
      toast({
        title: 'Error deleting API key',
        description: message ?? 'An error occurred while deleting your API key',
      });
      onActionFinished?.();
    },
  });

  const handleAction = (formData: FormData) => {
    formData.append('projectId', projectId);
    formData.append('apiKey', apiKey);
    formAction(formData);
  };

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <SubmitButton
          pending={pending}
          disabled={!projectId || !apiKey || pending}
          variant={{ variant: 'destructive' }}
          text="Revoke API key"
        />
      </div>
    </form>
  );
}

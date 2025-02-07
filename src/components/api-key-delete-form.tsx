import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface ApiKeyDeleteFormProps {
  projectId: string;
  apiKey: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function ApiKeyDeleteForm({ projectId, apiKey, action }: ApiKeyDeleteFormProps) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'API key deleted',
        description: 'Your API key has been deleted successfully',
      });
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
        {state.error && <p className="text-xs text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending && (
            <span className="animate-spin">
              <LoaderCircle />
            </span>
          )}
          Revoke API key
        </Button>
      </div>
    </form>
  );
}

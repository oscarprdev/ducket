import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface FileDeleteFormProps {
  selectedFiles: string[];
  apiKey: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
}

export default function FileDeleteForm({
  children,
  selectedFiles,
  apiKey,
  action,
  onActionFinished,
}: PropsWithChildren<FileDeleteFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({ title: 'Project created', description: 'Your project has been created' });
      onActionFinished?.();
    },
    onError: () => {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    },
  });

  const handleSubmit = (formData: FormData) => {
    formData.append('apiKey', apiKey);
    selectedFiles.forEach(fileName => {
      formData.append('selectedFiles[]', fileName);
    });
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex w-full justify-center gap-4">
      {children}
      <div className="space-y-2">
        {state.error && <p className="text-xs text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending && (
            <span className="animate-spin">
              <LoaderCircle />
            </span>
          )}
          {`Delete file${selectedFiles.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
}

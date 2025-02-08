import SubmitButton from './submit-button';
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
      toast({ title: 'File deleted', description: 'Your file has been deleted successfully' });
      onActionFinished?.();
    },
    onError: () => {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    },
  });

  const handleSubmit = async () => {
    await Promise.all(
      selectedFiles.map(fileName => {
        const formData = new FormData();
        formData.append('apiKey', apiKey);
        formData.append('selectedFile', fileName);
        return formAction(formData);
      })
    );
  };

  return (
    <form action={handleSubmit} className="flex w-full flex-col justify-center gap-4">
      {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
      <div className="flex items-center gap-2">
        {children}
        <SubmitButton
          pending={pending}
          disabled={selectedFiles.length === 0 || pending}
          text={`Delete file${selectedFiles.length > 1 ? 's' : ''}`}
        />
      </div>
    </form>
  );
}

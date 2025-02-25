import SubmitButton from '~/components/shared/submit-button';
import { Button } from '~/components/ui/button';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface DeleteProposalFormProps {
  proposalId: string;
  onActionFinished: () => void;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function DeleteProposalForm({
  proposalId,
  onActionFinished,
  action,
}: DeleteProposalFormProps) {
  const { toast } = useToast();
  const { formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Proposal deleted',
        description: 'Your proposal has been deleted successfully',
        variant: 'success',
      });
      onActionFinished();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.append('proposalId', proposalId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onActionFinished()}
          className="mr-auto w-full"
          disabled={pending}>
          Cancel
        </Button>
        <SubmitButton
          pending={pending}
          disabled={pending}
          text="Delete"
          variant={{ variant: 'destructive' }}
        />
      </div>
    </form>
  );
}

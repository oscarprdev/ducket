import { X } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import SubmitButton from '~/components/submit-button';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';

interface ApiKeysRevokeFormProps {
  selectedKeys: string[];
  projectId: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onActionFinished?: () => void;
  onFilesChange?: (keys: string[]) => void;
}

export default function ApiKeysRevokeForm({
  children,
  selectedKeys,
  projectId,
  action,
  onActionFinished,
  onFilesChange,
}: PropsWithChildren<ApiKeysRevokeFormProps>) {
  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'API keys revoked',
        description: 'Your API keys have been revoked successfully',
        variant: 'success',
      });
      onActionFinished?.();
    },
    onError: () => {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    },
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('selectedKeys', JSON.stringify(selectedKeys));
    formAction(formData);
  };

  const removeKey = (key: string) => {
    const newKeys = selectedKeys.filter(k => k !== key);
    onFilesChange?.(newKeys);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <p className="text-sm">Keys to revoke</p>
            <p className="text-xs text-muted-foreground">({selectedKeys.length})</p>
          </Label>
        </div>

        <div className="scrollable grid max-h-[200px] w-full gap-0.5 space-y-0.5 px-0">
          {selectedKeys.map((key, i) => (
            <div
              key={i}
              className="group flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1.5 text-sm text-destructive transition-colors">
              <div className="flex flex-col items-start">
                <div className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {`${key.slice(0, 5)}...${key.slice(-5)}`}
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 border border-destructive/20 bg-transparent text-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                      disabled={pending}
                      onClick={() => removeKey(key)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel deletion</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel deletion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {state.error && <p className="ml-auto text-xs text-destructive">{state.error}</p>}
        <div className="flex items-center gap-2">
          {children}
          <SubmitButton
            pending={pending}
            disabled={selectedKeys.length === 0 || pending}
            text={`Revoke Key${selectedKeys.length !== 1 ? 's' : ''}`}
            variant={{ variant: 'destructive' }}
          />
        </div>
      </div>
    </form>
  );
}

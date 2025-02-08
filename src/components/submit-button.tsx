import LoaderCircle from './icons/loader-circle';
import { Button, type buttonVariants } from './ui/button';
import { type VariantProps } from 'class-variance-authority';

export default function SubmitButton({
  pending,
  disabled,
  text,
  variant,
  className,
}: {
  pending: boolean;
  disabled: boolean;
  text: string;
  variant?: VariantProps<typeof buttonVariants>;
  className?: string;
}) {
  return (
    <Button type="submit" variant={variant?.variant ?? 'default'} disabled={disabled} className={className}>
      {pending && (
        <span className="animate-spin">
          <LoaderCircle />
        </span>
      )}
      {text}
    </Button>
  );
}

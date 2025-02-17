import * as React from 'react';
import { type PropsWithChildren } from 'react';
import { cn } from '~/lib/utils';

const FormErrorMessage = ({ className, children }: PropsWithChildren<{ className?: string }>) => {
  return (
    <p
      className={cn(
        '-mt-2 hidden text-xs text-destructive peer-[&:not(:placeholder-shown)]:peer-invalid:block',
        className
      )}>
      {children}
    </p>
  );
};

FormErrorMessage.displayName = 'FormErrorMessage';

export { FormErrorMessage };

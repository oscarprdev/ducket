'use client';

import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { signOutAction } from '~/app/dashboard/(dashboard)/actions';

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOutAction();
      }}
      className="flex items-center gap-2 p-2">
      <Button type="submit" variant="ghost">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}

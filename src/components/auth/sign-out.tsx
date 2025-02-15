'use client';

import { LogOut } from 'lucide-react';
import { signOutAction } from '~/app/dashboard/actions';

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOutAction();
      }}
      className="flex items-center gap-2 p-2">
      <LogOut className="mr-2 h-4 w-4" />
      <button type="submit">Logout</button>
    </form>
  );
}

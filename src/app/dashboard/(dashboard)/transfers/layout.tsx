import type React from 'react';
import { TransfersTabManager } from '~/components/dashboard/transfers/transfers-tab-manager';

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="mt-2 text-muted-foreground">View and manage your project transfers.</p>
      </div>
      <TransfersTabManager>{children}</TransfersTabManager>
    </>
  );
}

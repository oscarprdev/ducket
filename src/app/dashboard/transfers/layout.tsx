import type React from 'react';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import { TransfersTabManager } from '~/components/dashboard/transfers/transfers-tab-manager';

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout sidebarContent={<DashboardSidebar />}>
      <div>
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="mt-2 text-muted-foreground">View and manage your project transfers.</p>
      </div>
      <TransfersTabManager>{children}</TransfersTabManager>
    </DashboardLayout>
  );
}

'use client';

import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

interface TransfersTabManagerProps {
  children: React.ReactNode;
}

const TABS = {
  outgoing: 'outgoing',
  incoming: 'incoming',
} as const;

const tabs = {
  outgoing: {
    label: 'Outgoing',
    value: TABS.outgoing,
  },
  incoming: {
    label: 'Incoming',
    value: TABS.incoming,
  },
};
export function TransfersTabManager({ children }: TransfersTabManagerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isOutgoing = pathname.includes(TABS.outgoing);

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/transfers/${value}`);
  };

  return (
    <Tabs
      value={isOutgoing ? TABS.outgoing : TABS.incoming}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList>
        <TabsTrigger value={tabs.outgoing.value}>{tabs.outgoing.label}</TabsTrigger>
        <TabsTrigger value={tabs.incoming.value}>{tabs.incoming.label}</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

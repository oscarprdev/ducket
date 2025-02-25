'use client';

import { DocsInstallation } from './docs-installation';
import { DocsIntroduction } from './docs-introduction';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

type TabState = 'introduction' | 'installation' | 'upload' | 'get' | 'list' | 'delete';
const tabs = {
  introduction: 'introduction',
  installation: 'installation',
  upload: 'upload',
  get: 'get',
  list: 'list',
  delete: 'delete',
} as const as Record<TabState, TabState>;

export function DocsTabs() {
  const [tabState, setTabState] = useState<TabState>(tabs.introduction);

  return (
    <section className="relative h-screen max-w-[1200px] space-y-8 bg-background px-4">
      <Tabs
        className="mx-auto flex w-full flex-col items-center"
        value={tabState}
        onValueChange={(value: string) => setTabState(value as TabState)}>
        <TabsList>
          <TabsTrigger value={tabs.introduction} className="capitalize">
            {tabs.introduction}
          </TabsTrigger>
          <TabsTrigger value={tabs.installation} className="capitalize">
            {tabs.installation}
          </TabsTrigger>
          <TabsTrigger value={tabs.upload} className="capitalize">
            {tabs.upload}
          </TabsTrigger>
          <TabsTrigger value={tabs.get} className="capitalize">
            {tabs.get}
          </TabsTrigger>
          <TabsTrigger value={tabs.list} className="capitalize">
            {tabs.list}
          </TabsTrigger>
          <TabsTrigger value={tabs.delete} className="capitalize">
            {tabs.delete}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tabState}>
          {tabState === tabs.introduction && <DocsIntroduction />}
          {tabState === tabs.installation && <DocsInstallation />}
        </TabsContent>
      </Tabs>
    </section>
  );
}

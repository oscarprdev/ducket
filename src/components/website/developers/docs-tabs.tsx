'use client';

import { DocsDelete } from './docs-delete';
import { DocsGet } from './docs-get';
import { DocsInitialize } from './docs-initialize';
import { DocsInstallation } from './docs-installation';
import { DocsIntroduction } from './docs-introduction';
import { DocsList } from './docs-list';
import { DocsUpload } from './docs-upload';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

type TabState =
  | 'introduction'
  | 'installation'
  | 'initialize'
  | 'upload'
  | 'get'
  | 'list'
  | 'delete';
const tabs = {
  introduction: 'introduction',
  installation: 'installation',
  initialize: 'initialize',
  upload: 'upload',
  get: 'get',
  list: 'list',
  delete: 'delete',
} as const as Record<TabState, TabState>;

export function DocsTabs() {
  const [tabState, setTabState] = useState<TabState>(tabs.introduction);

  return (
    <section className="relative max-w-[1200px] space-y-8 bg-background px-4 pb-10">
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
          <TabsTrigger value={tabs.initialize} className="capitalize">
            {tabs.initialize}
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
          {tabState === tabs.initialize && <DocsInitialize />}
          {tabState === tabs.upload && <DocsUpload />}
          {tabState === tabs.get && <DocsGet />}
          {tabState === tabs.list && <DocsList />}
          {tabState === tabs.delete && <DocsDelete />}
        </TabsContent>
      </Tabs>
    </section>
  );
}

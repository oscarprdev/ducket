'use client';

import { HomeCopyButton } from './copy-button';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

type TabState = 'upload' | 'get' | 'list' | 'delete';
const tabs = {
  upload: 'upload',
  get: 'get',
  list: 'list',
  delete: 'delete',
} as const as Record<TabState, TabState>;

export function DeveloperCard() {
  const [tabState, setTabState] = useState<TabState>(tabs.upload);

  return (
    <section className="relative mx-auto h-screen max-w-[1200px] space-y-8 bg-background px-4 py-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">Developer mode</h2>
        <p className="mt-5 text-sm text-muted-foreground sm:text-base">
          Ducket provides a simple API for you to integrate with your existing framework.
          <br />
          Just use the API to list, get, upload, download and delete files usign your API Keys.
        </p>
      </div>
      <div className="relative mr-auto flex h-12 w-full max-w-[500px] items-center justify-between gap-2">
        <div className="flex w-full items-center justify-between rounded-md border-[1px] border-dashed border-muted-foreground/80 p-2 transition-colors duration-300 hover:bg-muted-foreground/10">
          <HomeCopyButton />
        </div>
        <Button variant="ghost" className="h-full">
          <Link
            href="https://www.npmjs.com/package/ducket"
            target="_blank"
            className="flex h-full w-full items-center justify-center">
            <Github className="size-full" />
          </Link>
        </Button>
      </div>

      <div className="relative h-full w-screen sm:w-full">
        <Tabs
          value={tabState}
          onValueChange={(value: string) => setTabState(value as TabState)}
          className="absolute top-5 z-50 flex w-full items-center justify-center">
          <TabsList>
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
        </Tabs>
        <span className="absolute left-0 top-0 h-full w-screen bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,#474747,rgba(54,54,54,0))] sm:w-full"></span>
        <motion.div
          initial={{ opacity: 0, y: 20, left: '50%', x: '-50%', top: '1/3' }}
          whileInView={{ opacity: 1, y: 0, left: '50%', x: '-50%', top: '1/3' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute mx-auto mt-20 w-[85vw] max-w-[800px] overflow-hidden rounded-xl border bg-zinc-950">
          <div className="border-b border-zinc-800">
            <div className="flex w-full items-start p-2">
              <span className="size-2.5 rounded-full border bg-destructive"></span>
              <span className="size-2.5 rounded-full border bg-tertiary"></span>
              <span className="size-2.5 rounded-full border bg-accent"></span>
            </div>
          </div>
          <div className="space-y-4 p-4">
            <code className="block font-mono text-xs">
              <span className="text-zinc-500">import</span>
              <span className="text-white"> {'{ '}</span>
              <span className="text-white">Bucket</span>
              <span className="text-white">{' }'}</span>
              <span className="text-zinc-500"> from </span>
              <span className="text-accent">{`'@bucket'`}</span>
              <span className="text-white">;</span>
            </code>
            <code className="block font-mono text-xs">
              <span className="text-zinc-500">const</span>
              <span className="text-white"> bucket = </span>
              <span className="text-zinc-500">new</span>
              <span className="text-white"> Bucket({'{'}</span>
              <div className="pl-4">
                <span className="text-white">useDucket:</span>
                <span className="text-accent"> true</span>
                <span className="text-white">,</span>
              </div>
              <div className="pl-4">
                <span className="text-white">apiKey: </span>
                <span className="text-accent">gI6ZDBq1GV....fv2t96Xd</span>
              </div>
              <span className="text-white">{'})'}</span>
              <span className="text-white">;</span>
            </code>
          </div>

          <div className="space-y-4 p-4">
            {tabState === tabs.upload ? (
              <UploadCode />
            ) : tabState === tabs.get ? (
              <GetCode />
            ) : tabState === tabs.list ? (
              <ListCode />
            ) : tabState === tabs.delete ? (
              <DeleteCode />
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const UploadCode = () => {
  return (
    <motion.code
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="block font-mono text-xs">
      <span className="text-zinc-500">export const</span>
      <span className="text-white"> uploadFile = </span>
      <span className="text-zinc-500">async</span>
      <span className="text-white">
        {' '}
        (formData: <span className="text-purple-300">FormData</span>) =&gt; {'{'}
      </span>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> file = formData.get(</span>
        <span className="text-accent">&apos;file&apos;</span>
        <span className="text-white">) </span>
        <span className="text-zinc-500">as</span>
        <span className="text-purple-300"> File</span>
        <span className="text-white">;</span>
      </div>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white">
          {' '}
          fileName = formData.<span>get</span>(
        </span>
        <span className="text-accent">&apos;fileName&apos;</span>
        <span className="text-white">);</span>
      </div>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> type = formData.get(</span>
        <span className="text-accent">&apos;type&apos;</span>
        <span className="text-white">);</span>
      </div>
      <div className="pl-4">
        <br />
        <span className="text-zinc-500">const</span>
        <span className="text-white"> arrayBuffer = </span>
        <span className="text-zinc-500">await</span>
        <span className="text-white"> file.arrayBuffer();</span>
      </div>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> buffer = Buffer.from(arrayBuffer);</span>
      </div>
      <div className="pl-4">
        <br />
        <span className="text-zinc-500">await</span>
        <span className="text-white">
          {' '}
          bucket.<span className="text-orange-300">uploadFile</span>({'{'}
        </span>
      </div>
      <div className="pl-8">
        <span className="text-white">file: buffer,</span>
      </div>
      <div className="pl-8">
        <span className="text-white">name: fileName,</span>
      </div>
      <div className="pl-8">
        <span className="text-white">type,</span>
      </div>
      <div className="pl-4">
        <span className="text-white">{'}'});</span>
      </div>
      <span className="text-white">{'};'}</span>
    </motion.code>
  );
};

const GetCode = () => {
  return (
    <motion.code
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="block font-mono text-xs">
      <span className="text-zinc-500">export const</span>
      <span className="text-white"> getFile = </span>
      <span className="text-zinc-500">async</span>
      <span className="text-white">
        {' '}
        (formData: <span className="text-purple-300">FormData</span>) =&gt; {'{'}
      </span>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> fileName = formData.get(</span>
        <span className="text-accent">&apos;fileName&apos;</span>
        <span className="text-white">) </span>
        <span className="text-zinc-500">as</span>
        <span className="text-purple-300"> string</span>
        <span className="text-white">;</span>
      </div>
      <br />
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> file = </span>
        <span className="text-zinc-500">await</span>
        <span className="text-white">
          {' '}
          bucket.<span className="text-orange-300">getFile</span>({'{'}
        </span>
      </div>
      <div className="pl-8">
        <span className="text-white">name: fileName</span>
      </div>
      <div className="pl-4">
        <span className="text-white">{'}'});</span>
      </div>
      <span className="text-white">{'};'}</span>
    </motion.code>
  );
};

const DeleteCode = () => {
  return (
    <motion.code
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="block font-mono text-xs">
      <span className="text-zinc-500">export const</span>
      <span className="text-white"> deleteFile = </span>
      <span className="text-zinc-500">async</span>
      <span className="text-white">
        {' '}
        (formData: <span className="text-purple-300">FormData</span>) =&gt; {'{'}
      </span>
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> fileName = formData.get(</span>
        <span className="text-accent">&apos;fileName&apos;</span>
        <span className="text-white">) </span>
        <span className="text-zinc-500">as</span>
        <span className="text-purple-300"> string</span>
        <span className="text-white">;</span>
      </div>
      <br />
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> file = </span>
        <span className="text-zinc-500">await</span>
        <span className="text-white">
          {' '}
          bucket.<span className="text-orange-300">deleteFile</span>({'{'}
        </span>
      </div>
      <div className="pl-8">
        <span className="text-white">name: fileName</span>
      </div>
      <div className="pl-4">
        <span className="text-white">{'}'});</span>
      </div>
      <span className="text-white">{'};'}</span>
    </motion.code>
  );
};

const ListCode = () => {
  return (
    <motion.code
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="block font-mono text-xs">
      <span className="text-zinc-500">export const</span>
      <span className="text-white"> listFiles = </span>
      <span className="text-zinc-500">async</span>
      <span className="text-white"> () =&gt; {'{'}</span>
      <br />
      <div className="pl-4">
        <span className="text-zinc-500">const</span>
        <span className="text-white"> files = </span>
        <span className="text-zinc-500">await</span>
        <span className="text-white">
          {' '}
          bucket.<span className="text-orange-300">listFiles()</span>;
        </span>
      </div>
      <span className="text-white">{'};'}</span>
    </motion.code>
  );
};

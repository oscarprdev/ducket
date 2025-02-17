'use client';

import { ApiKeyDocsAside } from './api-key-docs-aside';
import { ApiKeysCreateDialog } from './api-keys-create-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { CodeXml } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { TooltipContent } from '~/components/ui/tooltip';
import { Tooltip, TooltipTrigger } from '~/components/ui/tooltip';
import { TooltipProvider } from '~/components/ui/tooltip';

export default function ApiKeysLayout({
  children,
  projectId,
  userIsOwner,
}: {
  children: React.ReactNode;
  projectId: string;
  userIsOwner?: boolean;
}) {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Manage your API keys and their permissions for this project.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userIsOwner && <ApiKeysCreateDialog projectId={projectId} />}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setShowDocs(true)}>
                  <CodeXml className="size-4" />
                  API
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open API Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {children}
      <AnimatePresence>
        {showDocs && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black backdrop-blur-2xl"
              onClick={() => setShowDocs(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 right-0 z-50 h-screen w-[600px] bg-background px-6 shadow-lg">
              <ApiKeyDocsAside onClose={() => setShowDocs(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card } from '~/components/ui/card';

export function UsageCard() {
  return (
    <Card className="w-full bg-muted/30 p-4 sm:p-6">
      <section className="flex h-full w-full flex-col items-start gap-6">
        <div className="flex h-full w-full flex-col gap-2">
          <h3 className="text-xl font-bold sm:text-2xl">Usage</h3>
          <p className="text-pretty text-sm text-muted-foreground">
            Every free account has a bunch of storage space.
            <br className="hidden sm:block" />
            Up to 1GB of files storage to start your projects now.
            {/* You can upgrade your account to get more storage space and other
            features later. */}
          </p>
        </div>

        <div className="mt-2 flex h-full w-full flex-col gap-3 sm:mt-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex w-full flex-col gap-2 border border-border bg-muted/90 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Storage Used</p>
              <p className="text-sm text-muted-foreground">750MB / 1GB</p>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                whileInView={{ width: '75%' }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.7,
                  ease: 'easeOut',
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </Card>
  );
}

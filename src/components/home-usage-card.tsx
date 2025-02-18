'use client';

import { Card } from './ui/card';
import { motion } from 'framer-motion';

export function HomeUsageCard() {
  return (
    <Card className="w-full bg-muted/30 p-6 px-6">
      <section className="flex h-full w-full flex-col items-start gap-6">
        <div className="flex h-full w-full flex-col gap-2 pr-5">
          <h3 className="text-2xl font-bold">Usage</h3>
          <p className="text-pretty text-sm text-muted-foreground">
            Every free account has a bunch of storage space. Up to 1GB of files storage to start
            your projects now. You can upgrade your account to get more storage space and other
            features later.
          </p>
        </div>

        <div className="flex h-full w-full flex-col gap-3">
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
                  delay: 0.3,
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

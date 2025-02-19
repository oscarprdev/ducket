'use client';

import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Users } from 'lucide-react';

export function HomeUsersCard() {
  return (
    <Card className="w-full bg-muted/30 p-4 sm:p-6">
      <section className="flex h-full w-full flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex h-full w-full flex-col gap-2 lg:w-1/2">
          <h3 className="text-xl font-bold sm:text-2xl">Users</h3>
          <p className="text-pretty text-sm text-muted-foreground">
            You can also invite users with different permissions to work with your files in a secure
            way.
          </p>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            If needed, it is possible to transfer ownership of a project to another user.
          </p>
        </div>

        <div className="flex h-full w-full flex-col gap-3 lg:w-1/2">
          {/* Admin item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex w-full items-center justify-between gap-2 border border-border bg-muted/90 p-2 px-5">
            <div className="flex items-center space-x-4">
              <Lock className="h-4 w-4" />
              <p className="text-sm font-medium">Admin</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 }}>
              <Badge variant={'outline'} className="">
                All permissions
              </Badge>
            </motion.div>
          </motion.div>

          {/* Invited item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative flex w-full flex-col items-center justify-between gap-4 border border-border bg-muted/90 p-4">
            <div className="flex items-center space-x-4">
              <Users className="h-4 w-4" />
              <p className="text-sm font-medium">Invited</p>
            </div>
            <div className="flex gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.5 }}>
                <Badge variant={'default'} className="">
                  Read
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 2 }}>
                <Badge variant={'default'} className="">
                  Write
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 2.5 }}>
                <Badge variant={'default'} className="">
                  Delete
                </Badge>
              </motion.div>
            </div>
          </motion.div>
          {/* Transfer ownership item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 3 }}
            className="relative flex w-full items-center justify-center gap-2 border border-border bg-muted/90 p-2 px-5">
            <p className="text-sm font-medium">Transfer ownership</p>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </section>
    </Card>
  );
}

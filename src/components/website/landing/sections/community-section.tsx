'use client';

import { AnimatedCounter } from '../animated-counter';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export function CommunitySection() {
  return (
    <section className="relative mx-auto flex h-full max-w-[1200px] flex-col gap-8 space-y-8 bg-background px-4 py-12">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold md:text-6xl lg:text-7xl">Community</h2>
        <p className="mt-5 text-muted-foreground">
          Everyday more and more users are transitioning to Ducket. Are you one of them?
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto grid w-full max-w-[800px] grid-cols-2 gap-8 md:grid-cols-4">
        <div className="w-full text-center">
          <p className="mb-1 text-sm text-muted-foreground">Active users</p>
          <AnimatedCounter value={113} className="text-2xl font-bold sm:text-3xl" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-sm text-muted-foreground">Files</p>
          <AnimatedCounter value={451} className="text-2xl font-bold sm:text-3xl" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-sm text-muted-foreground">Projects</p>
          <AnimatedCounter value={57} className="text-2xl font-bold sm:text-3xl" />
        </div>
        <div className="text-center">
          <p className="mb-1 text-sm text-muted-foreground">Downloads</p>
          <AnimatedCounter value={231} className="text-2xl font-bold sm:text-3xl" />
        </div>
        <div className="absolute bottom-0 left-1/4 top-0 hidden w-px bg-muted-foreground/40 md:block"></div>
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-muted-foreground/40 md:block"></div>
        <div className="absolute bottom-0 left-3/4 top-0 hidden w-px bg-muted-foreground/40 md:block"></div>
      </motion.div>

      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 md:flex-row">
        <Button asChild className="flex-1">
          <Link href="/sign-in">Start your project</Link>
        </Button>
        <Button variant="outline" className="flex-1">
          <Link href="/docs">Read documentation</Link>
        </Button>
      </div>
    </section>
  );
}

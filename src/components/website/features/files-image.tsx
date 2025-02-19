'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FeatureImageProps {
  src: string;
  alt: string;
}

export function FeatureImage({ src, alt }: FeatureImageProps) {
  return (
    <motion.div
      className="relative aspect-[16/9] w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-lg border border-border object-cover"
        priority
      />
    </motion.div>
  );
}

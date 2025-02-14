'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function RotatingText() {
  const words = ['developers.', 'students.', 'creators.', 'start-ups.', 'everyone.'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-block min-w-[140px] text-primary">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-block">
          {words[currentIndex]?.split('').map((letter, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.25,
                    delay: index * 0.03,
                  },
                },
                exit: {
                  opacity: 0,
                  y: -10,
                  transition: {
                    duration: 0.25,
                    delay: index * 0.03,
                  },
                },
              }}
              className="inline-block">
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

'use client';

import NumberFlow from '@number-flow/react';
import { useEffect } from 'react';
import { useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const step = Math.ceil(value / 100);
    const intervalId = setInterval(() => {
      setCount(c => {
        if (c >= value) {
          clearInterval(intervalId);
          return value;
        }
        return Math.min(c + step, value);
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, [value]);

  return (
    <div
      className={`${className} flex items-center justify-center gap-1 bg-clip-text text-transparent`}
      style={{
        WebkitTextStroke: '1px white',
        fontWeight: 800,
        letterSpacing: '0.05em',
      }}>
      <NumberFlow isolate trend={1} value={count} />+
    </div>
  );
}

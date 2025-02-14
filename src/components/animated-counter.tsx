'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ end, duration = 2000, className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const step = Math.ceil(end / 100); // Increase step size for smoother animation
    const intervalId = setInterval(() => {
      setCount(c => {
        if (c >= end) {
          clearInterval(intervalId);
          return end;
        }
        return Math.min(c + step, end);
      });
    }, duration / 100);

    return () => clearInterval(intervalId);
  }, [end, duration]);

  return (
    <p
      className={`${className} bg-muted-foreground/20 bg-clip-text text-transparent`}
      style={{
        WebkitTextStroke: '1px white',
        fontWeight: 800,
        letterSpacing: '0.05em',
      }}>
      +{count.toLocaleString()}
    </p>
  );
}

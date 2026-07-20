import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface CounterProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

export const Counter = ({ value, format, duration = 1.2, className }: CounterProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{format ? format(display) : Math.round(display).toLocaleString('en-IN')}</span>;
};

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const Card = ({ children, className = '', delay = 0, hover = true }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={hover ? { y: -4 } : undefined}
    className={`card ${className}`}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">{title}</h3>
      {subtitle && <p className="text-sm text-navy-500 dark:text-navy-400 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

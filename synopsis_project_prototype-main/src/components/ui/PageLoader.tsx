import { motion } from 'framer-motion';

export const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-navy-700 theme-corporate:border-blue-800 border-t-primary-600"
    />
    <motion.p
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-sm text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 font-medium"
    >
      Loading analytics...
    </motion.p>
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="h-4 w-24 bg-navy-200 dark:bg-navy-700 theme-corporate:bg-blue-800 rounded mb-3" />
    <div className="h-8 w-32 bg-navy-200 dark:bg-navy-700 theme-corporate:bg-blue-800 rounded mb-4" />
    <div className="h-24 bg-navy-100 dark:bg-navy-700/50 theme-corporate:bg-blue-800/50 rounded" />
  </div>
);

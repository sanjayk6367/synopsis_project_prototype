import { ReactNode, useState, useEffect, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { WelcomeBanner } from './WelcomeBanner';
import { PageLoader } from './ui/PageLoader';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  banner?: boolean;
  actions?: ReactNode;
}

export const AppLayout = ({ children, title, banner = false, actions }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-navy-50 dark:bg-navy-900 theme-corporate:bg-blue-950">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 className="text-2xl font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50 tracking-tight">{title}</h1>
                <p className="text-sm text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 mt-0.5">
                  Real-time analytics powered by Microsoft SQL Server &amp; Power BI
                </p>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {banner && <WelcomeBanner />}
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </motion.div>
        </main>
        <footer className="px-6 py-4 text-center text-xs text-navy-400 dark:text-navy-500 theme-corporate:text-blue-400 border-t border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40">
          <p>Sales Analytics Dashboard <span className="px-1.5 py-0.5 rounded bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 font-mono">v1.0</span> — Developed by B.Tech AI &amp; DS Student</p>
          <p className="mt-1">© 2025 Final Year Project · Data Analytics on Sales Data Using Power BI and MS SQL Server</p>
        </footer>
      </div>
    </div>
  );
};

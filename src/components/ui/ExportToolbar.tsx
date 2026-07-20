import { FileText, FileSpreadsheet, Printer, Share2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportToolbarProps { label?: string; }

export const ExportToolbar = ({ label = 'Export' }: ExportToolbarProps) => {
  const [toast, setToast] = useState<string | null>(null);
  const notify = (name: string) => {
    setToast(`${name} export ready — demo mode`);
    setTimeout(() => setToast(null), 2000);
  };
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => notify('PDF')} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50"><FileText size={15} className="text-rose-600" /> PDF</button>
        <button onClick={() => notify('Excel')} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50"><FileSpreadsheet size={15} className="text-emerald-600" /> Excel</button>
        <button onClick={() => notify('CSV')} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50"><FileText size={15} className="text-blue-600" /> CSV</button>
        <button onClick={() => notify('Print')} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50"><Printer size={15} className="text-violet-600" /> Print</button>
        <button onClick={() => notify('Share')} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50"><Share2 size={15} className="text-cyan-600" /> Share</button>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-xl px-4 py-2.5 shadow-card text-sm text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

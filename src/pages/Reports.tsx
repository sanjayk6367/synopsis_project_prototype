import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { reportsList } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Printer, Share2, FileSpreadsheet, X } from 'lucide-react';

const exportActions = [
  { label: 'Export PDF', icon: FileText, color: 'text-rose-600' },
  { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-emerald-600' },
  { label: 'Print Report', icon: Printer, color: 'text-blue-600' },
  { label: 'Share Dashboard', icon: Share2, color: 'text-violet-600' },
];

export const Reports = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (label: string) => {
    setToast(`${label} — feature ready for demonstration`);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <AppLayout title="Reports">
      <Card delay={0} className="p-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">Report Center</h3>
            <p className="text-sm text-navy-500 dark:text-navy-400 mt-0.5">Generate, export and share business reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exportActions.map(a => (
              <button key={a.label} onClick={() => notify(a.label)} className="btn-ghost text-sm border border-navy-200 dark:border-navy-700">
                <a.icon size={15} className={a.color} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((r, i) => (
          <Card key={r.name} delay={i * 0.06} className="p-5 group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-soft mb-4`}>
              <Icon name={r.icon} size={22} />
            </div>
            <h3 className="text-base font-semibold text-navy-900 dark:text-white">{r.name}</h3>
            <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{r.desc}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setSelected(r.name)} className="btn-primary text-sm flex-1">
                <FileText size={14} /> Generate
              </button>
              <button onClick={() => notify('Download')} className="btn-ghost border border-navy-200 dark:border-navy-700">
                <Download size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-lg w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white">{selected}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-400 mt-0.5">Report generation preview</p>
                </div>
                <button onClick={() => setSelected(null)} className="btn-ghost"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {['Summary', 'Key Metrics', 'Trend Analysis', 'Regional Breakdown', 'Recommendations'].map((sec, i) => (
                  <motion.div key={sec} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="p-3 rounded-xl bg-navy-50 dark:bg-navy-700/30">
                    <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{sec}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 rounded-full bg-navy-200 dark:bg-navy-600 w-full" />
                      <div className="h-2 rounded-full bg-navy-200 dark:bg-navy-600 w-4/5" />
                      <div className="h-2 rounded-full bg-navy-200 dark:bg-navy-600 w-3/5" />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => notify('Export PDF')} className="btn-primary text-sm flex-1"><FileText size={14} /> Export PDF</button>
                <button onClick={() => notify('Export Excel')} className="btn-ghost border border-navy-200 dark:border-navy-700 text-sm"><FileSpreadsheet size={14} /> Excel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-xl px-4 py-2.5 shadow-card text-sm text-navy-800 dark:text-navy-100"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

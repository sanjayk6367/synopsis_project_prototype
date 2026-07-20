import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { sqlQueries, INR, INR_CR } from '../data/mockData';
import { Terminal, Play, Copy, Check, Database, Table2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const highlightSql = (sql: string) => {
  const keywords = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|ON|TOP|SUM|COUNT|MONTH|YEAR|BETWEEN|AND|AS|DESC|ASC)\b/g;
  const strings = /'[^']*'/g;
  return sql
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(strings, '<span class="text-emerald-400">$&</span>')
    .replace(keywords, '<span class="text-primary-400 font-semibold">$&</span>');
};

const formatCell = (v: any) => {
  if (typeof v === 'number' && v > 1000) return INR(v);
  return String(v);
};

export const SqlQuery = () => {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const q = sqlQueries[active];

  const copy = () => {
    navigator.clipboard?.writeText(q.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const run = () => {
    setRunning(true);
    setShowResult(false);
    setTimeout(() => { setRunning(false); setShowResult(true); }, 700);
  };

  return (
    <AppLayout title="SQL Query Editor">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Query list */}
        <div className="card p-3 h-fit">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Terminal size={16} className="text-primary-600" />
            <h3 className="text-sm font-semibold text-navy-900 dark:text-navy-100">Sample Queries</h3>
          </div>
          <div className="space-y-1">
            {sqlQueries.map((sq, i) => (
              <button
                key={sq.name}
                onClick={() => { setActive(i); setShowResult(true); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${active === i ? 'bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300 font-medium' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700/60'}`}
              >
                <span className="font-mono text-xs text-navy-400 mr-2">{String(i + 1).padStart(2, '0')}</span>
                {sq.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor + results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-navy-900 dark:bg-navy-950 border-b border-navy-700">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Database size={14} />
                <span className="font-mono">query.sql</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copy} className="px-2.5 py-1 rounded-lg text-xs text-white/80 hover:bg-white/10 flex items-center gap-1.5">
                  {copied ? <><Check size={13} className="text-emerald-400" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
                <button onClick={run} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
                  {running ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full" /> : <Play size={13} />}
                  {running ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
            <div className="bg-navy-900 dark:bg-navy-950 p-4 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed text-navy-200 whitespace-pre-wrap">
                <code dangerouslySetInnerHTML={{ __html: highlightSql(q.sql) }} />
              </pre>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table2 size={16} className="text-primary-600" />
                <h3 className="text-sm font-semibold text-navy-900 dark:text-navy-100">Query Results</h3>
              </div>
              <span className="chip bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                {showResult && !running ? `${q.rows.length} rows` : '—'}
              </span>
            </div>
            <AnimatePresence mode="wait">
              {running ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full" />
                  <p className="mt-3 text-sm text-navy-500">Executing query on SQL Server...</p>
                </motion.div>
              ) : showResult ? (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-100 dark:border-navy-700/60 text-left text-xs uppercase text-navy-500">
                        {q.columns.map(c => <th key={c} className="px-3 py-2 font-medium">{c}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {q.rows.map((row, i) => (
                        <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-navy-50 dark:border-navy-700/30 hover:bg-primary-50/40 dark:hover:bg-primary-600/10">
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2.5 text-navy-700 dark:text-navy-200 font-mono text-xs">
                              {typeof cell === 'number' && cell > 1000 ? INR_CR(cell) : String(cell)}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

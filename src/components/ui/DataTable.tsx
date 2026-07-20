import { useState, useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  title?: string;
  rightSlot?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, pageSize = 8, searchable = true, searchKeys, title, rightSlot,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;
    if (query && searchKeys) {
      const q = query.toLowerCase();
      rows = rows.filter(r => searchKeys.some(k => String(r[k]).toLowerCase().includes(q)));
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [data, query, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="card p-4">
      {(searchable || title || rightSlot) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {title && <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">{title}</h3>}
            <span className="chip bg-navy-100 dark:bg-navy-700/60 text-navy-600 dark:text-navy-300">{filtered.length} rows</span>
          </div>
          <div className="flex items-center gap-2">
            {rightSlot}
            {searchable && (
              <div className="relative">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search..."
                  className="input pl-8 h-9 w-48 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-100 dark:border-navy-700/60 text-navy-500 dark:text-navy-400">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-3 py-2.5 font-medium text-xs uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.sortable !== false ? (
                    <button
                      onClick={() => toggleSort(String(col.key))}
                      className="inline-flex items-center gap-1 hover:text-navy-800 dark:hover:text-navy-200"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-navy-50 dark:border-navy-700/30 hover:bg-primary-50/40 dark:hover:bg-primary-600/10 transition-colors"
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={`px-3 py-2.5 text-navy-700 dark:text-navy-200 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
            {pageRows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-3 py-8 text-center text-navy-400">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <p className="text-navy-500 dark:text-navy-400 text-xs">
          Page {currentPage} of {totalPages} · {filtered.length} records
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-ghost h-8 w-8 p-0 disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-ghost h-8 w-8 p-0 disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { YEARS, MONTHS, STATES, CITIES, CATEGORIES, CUSTOMER_TYPES, PAYMENT_METHODS, SALES_REPS } from '../data/mockData';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const filterConfig: { key: keyof import('../context/FilterContext').Filters; label: string; options: string[] }[] = [
  { key: 'year', label: 'Year', options: ['All', ...YEARS.map(String)] },
  { key: 'quarter', label: 'Quarter', options: ['All', ...QUARTERS] },
  { key: 'month', label: 'Month', options: ['All', ...MONTHS] },
  { key: 'state', label: 'State', options: ['All', ...STATES] },
  { key: 'city', label: 'City', options: ['All', ...CITIES] },
  { key: 'category', label: 'Category', options: ['All', ...CATEGORIES as unknown as string[]] },
  { key: 'customerType', label: 'Customer Type', options: ['All', ...CUSTOMER_TYPES] },
  { key: 'paymentMethod', label: 'Payment', options: ['All', ...PAYMENT_METHODS] },
  { key: 'salesRep', label: 'Sales Rep', options: ['All', ...SALES_REPS] },
];

const Select = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-w-[140px]">
      <button
        onClick={() => setOpen(o => !o)}
        className="input flex items-center justify-between gap-2 text-left"
      >
        <span className="truncate">
          <span className="text-navy-400 dark:text-navy-500 text-xs mr-1.5">{label}:</span>
          <span className="font-medium">{value}</span>
        </span>
        <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-30 mt-1 w-full max-h-56 overflow-auto card p-1"
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-navy-100 dark:hover:bg-navy-700 ${opt === value ? 'bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300 font-medium' : ''}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FilterBar = () => {
  const { filters, setFilter, reset } = useFilters();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="card p-3 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-200">
          <Filter size={16} className="text-primary-600" />
          Filters
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="btn-ghost text-xs"><RotateCcw size={14} /> Reset</button>
          <button onClick={() => setCollapsed(c => !c)} className="btn-ghost text-xs">
            {collapsed ? 'Show' : 'Hide'}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-1">
              {filterConfig.map(f => (
                <Select
                  key={f.key}
                  label={f.label}
                  value={(filters as any)[f.key]}
                  options={f.options}
                  onChange={(v) => setFilter(f.key, v)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

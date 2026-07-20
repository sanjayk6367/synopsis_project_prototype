import { createContext, useContext, useState, ReactNode } from 'react';

export interface Filters {
  year: string;
  quarter: string;
  month: string;
  state: string;
  city: string;
  category: string;
  customerType: string;
  paymentMethod: string;
  salesRep: string;
}

const defaultFilters: Filters = {
  year: '2025', quarter: 'All', month: 'All', state: 'All',
  city: 'All', category: 'All', customerType: 'All', paymentMethod: 'All', salesRep: 'All',
};

interface FilterCtx {
  filters: Filters;
  setFilter: (k: keyof Filters, v: string) => void;
  reset: () => void;
}

const Ctx = createContext<FilterCtx>({ filters: defaultFilters, setFilter: () => {}, reset: () => {} });

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const setFilter = (k: keyof Filters, v: string) => setFilters(f => ({ ...f, [k]: v }));
  const reset = () => setFilters(defaultFilters);
  return <Ctx.Provider value={{ filters, setFilter, reset }}>{children}</Ctx.Provider>;
};

export const useFilters = () => useContext(Ctx);

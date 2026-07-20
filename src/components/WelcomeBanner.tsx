import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { INR_CR } from '../data/mockData';
import { Sparkline } from './ui/Sparkline';
import { Calendar, Clock, TrendingUp, ShoppingCart, Users, IndianRupee, Sparkles } from 'lucide-react';

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const summary = [
  { label: 'Today Sales', value: '₹1.84 Cr', growth: '+12.4%', icon: ShoppingCart, spark: [12, 14, 13, 16, 18, 17, 20, 22, 21, 24, 26, 28] },
  { label: 'MTD Revenue', value: '₹48.2 Cr', growth: '+14.2%', icon: IndianRupee, spark: [20, 22, 24, 23, 28, 30, 32, 34, 36, 38, 42, 48] },
  { label: 'New Customers', value: '128', growth: '+8.6%', icon: Users, spark: [8, 10, 9, 12, 14, 13, 16, 18, 17, 20, 22, 24] },
  { label: 'Orders Today', value: '342', growth: '+6.4%', icon: TrendingUp, spark: [22, 24, 26, 25, 28, 30, 32, 34, 33, 36, 38, 42] },
];

export const WelcomeBanner = () => {
  const now = useClock();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-primary-900 to-navy-900 text-white p-5 md:p-6 mb-5 shadow-card"
    >
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute -left-10 -bottom-20 w-56 h-56 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-primary-200 text-xs font-medium uppercase tracking-widest">
            <Sparkles size={13} /> Sales Analytics Dashboard
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-1.5 tracking-tight">
            {greeting}, <span className="text-primary-300">Admin</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {dateStr}</span>
            <span className="flex items-center gap-1.5 font-mono"><Clock size={14} /> {timeStr}</span>
          </div>
          <p className="text-sm text-white/70 mt-2 max-w-xl">
            Your business is performing <span className="text-emerald-300 font-semibold">18.4% above</span> last year. South region leads growth at 18.6%. 3 insights need your attention.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:max-w-2xl">
          {summary.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className="glass rounded-xl p-3 min-w-[140px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur">
                  <s.icon size={15} />
                </div>
                <span className="text-[10px] text-emerald-300 font-semibold">{s.growth}</span>
              </div>
              <p className="text-lg font-bold mt-1.5">{s.value}</p>
              <p className="text-[10px] text-white/70">{s.label}</p>
              <div className="-mx-1 mt-1">
                <Sparkline data={s.spark} color="rgba(255,255,255,0.7)" height={24} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

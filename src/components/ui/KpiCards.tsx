import { KPIS, INR_CR } from '../../data/mockData';
import { Card, Counter } from './Card';
import { Sparkline } from './Sparkline';
import { Icon } from './Icon';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatValue = (kpi: typeof KPIS[number], n: number) => {
  if (kpi.suffix === '%') return n.toFixed(1) + '%';
  if (kpi.suffix === '/5') return n.toFixed(1) + '/5';
  if (kpi.key === 'aov') return '₹' + Math.round(n).toLocaleString('en-IN');
  return INR_CR(n);
};

export const KpiCards = ({ limit }: { limit?: number }) => {
  const items = limit ? KPIS.slice(0, limit) : KPIS;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((kpi, i) => (
        <Card key={kpi.key} delay={i * 0.05} className="overflow-hidden relative p-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-90`} />
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/15" />
          <div className="relative p-4 text-white">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <Icon name={kpi.icon} size={20} />
              </div>
              <span className="chip bg-white/20 text-white">
                {kpi.growth > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(kpi.growth)}%
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-white/80">{kpi.label}</p>
            <motion.div
              key={kpi.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold mt-0.5 tracking-tight"
            >
              <Counter value={kpi.value} format={(n) => formatValue(kpi, n)} />
            </motion.div>
            <div className="mt-2 -mx-1">
              <Sparkline data={kpi.sparkline} color="rgba(255,255,255,0.85)" height={36} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

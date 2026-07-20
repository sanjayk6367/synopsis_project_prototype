import { AppLayout } from '../components/AppLayout';
import { businessInsights, aiRecommendations } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Sparkline } from '../components/ui/Sparkline';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Lightbulb, Brain, Sparkles, Zap, Gauge } from 'lucide-react';

const sparkData = (i: number) => {
  const base = [12, 18, 15, 22, 28, 24, 32, 30, 36, 42, 38, 48];
  return base.map(v => v + (i % 6) * 2 - 6 + Math.round(Math.sin(v + i) * 3));
};

const impactColor: Record<string, string> = {
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Low: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
};

export const BusinessInsights = () => (
  <AppLayout title="Business Insights" actions={<ExportToolbar />}>
    <Card delay={0} className="p-5 mb-5 bg-gradient-to-br from-primary-600 to-violet-600 text-white border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur shrink-0">
          <Lightbulb size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-300" />
            <h2 className="text-xl font-bold">AI-Powered Business Insights</h2>
          </div>
          <p className="text-white/85 text-sm mt-1 max-w-3xl">
            Automatically generated recommendations based on 5 years of sales data, profit patterns, customer behavior and regional trends. Use these insights for strategic decision-making.
          </p>
        </div>
      </div>
    </Card>

    <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100 mb-3 flex items-center gap-2">
      <Zap size={16} className="text-amber-500" /> Key Insights
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {businessInsights.map((ins, i) => (
        <Card key={ins.title} delay={i * 0.05} className="p-4 overflow-hidden relative">
          <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${ins.color} opacity-15`} />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ins.color} flex items-center justify-center text-white shadow-soft`}>
                <Icon name={ins.icon} size={20} />
              </div>
              <span className={`chip ${ins.up ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                {ins.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {ins.trend}
              </span>
            </div>
            <p className="mt-3 text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 font-medium uppercase tracking-wider">{ins.title}</p>
            <p className="text-lg font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50 mt-0.5">{ins.value}</p>
            <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 mt-1">{ins.desc}</p>
            <div className="mt-3 -mx-1">
              <Sparkline data={sparkData(i)} color={ins.up ? '#10b981' : '#ef4444'} height={36} />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {ins.up ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />}
              <span className={ins.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {ins.up ? 'Positive trend' : 'Needs attention'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100 mb-3 flex items-center gap-2">
      <Brain size={16} className="text-violet-600" /> AI Recommendations
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {aiRecommendations.map((rec, i) => (
        <motion.div
          key={rec.title}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className="card p-5 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rec.color}`} />
          <div className="flex items-start justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center text-white shadow-soft`}>
              <Icon name={rec.icon} size={20} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`chip ${impactColor[rec.impact]}`}>{rec.impact}</span>
            </div>
          </div>
          <h4 className="text-sm font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50">{rec.title}</h4>
          <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 mt-1.5 leading-relaxed">{rec.rationale}</p>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40">
            <div>
              <p className="text-[10px] text-navy-400 uppercase tracking-wider">Projected Impact</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{rec.metric}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-navy-400 uppercase tracking-wider flex items-center gap-1 justify-end"><Gauge size={10} /> Confidence</p>
              <p className="text-sm font-bold text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100">{rec.confidence}%</p>
            </div>
          </div>
          <div className="mt-2 h-1 rounded-full bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${rec.confidence}%` }} transition={{ duration: 0.9, delay: i * 0.06 }} className={`h-full rounded-full bg-gradient-to-r ${rec.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  </AppLayout>
);

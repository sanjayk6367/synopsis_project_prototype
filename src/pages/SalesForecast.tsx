import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { Icon } from '../components/ui/Icon';
import { salesForecast, forecastAccuracy, forecastScenarios, forecastDrivers, INR_CR } from '../data/mockData';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Target, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Q4 Forecast', value: '₹62.4 Cr', icon: 'LineChart', color: 'from-blue-500 to-blue-600' },
  { label: 'Model Accuracy', value: '87.4%', icon: 'Target', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Confidence', value: 'High', icon: 'ShieldCheck', color: 'from-violet-500 to-violet-600' },
  { label: 'Growth Projected', value: '+23.6%', icon: 'TrendingUp', color: 'from-amber-500 to-amber-600' },
];

const scenarioColors = forecastScenarios.map(s => s.color);

export const SalesForecast = () => (
  <AppLayout title="Sales Forecast" actions={<ExportToolbar />}>
    <Card delay={0} className="p-5 mb-5 bg-gradient-to-br from-primary-600 to-violet-700 text-white border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur shrink-0">
          <Brain size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-300" />
            <h2 className="text-xl font-bold">ML-Powered Forecast Engine</h2>
          </div>
          <p className="text-white/85 text-sm mt-1 max-w-3xl">
            Time-series model trained on 5 years of historical sales data. Predictions incorporate seasonality, festival demand, product launches, and market expansion signals. Confidence: 87.4%.
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map((s, i) => (
        <Card key={s.label} delay={i * 0.05} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
              <Icon name={s.icon} size={20} />
            </div>
            <div>
              <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">{s.label}</p>
              <p className="text-xl font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50">{s.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Sales Forecast" subtitle="Actual vs predicted (₹)" csvData={salesForecast} delay={0.05} className="lg:col-span-2">
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesForecast} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => INR_CR(v)} width={56} />
              <Tooltip formatter={(v: any) => INR_CR(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" strokeWidth={2.5} fill="url(#fc)" connectNulls />
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Forecast Accuracy" subtitle="Predicted vs actual" csvData={forecastAccuracy} delay={0.1}>
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastAccuracy} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} tickFormatter={(v) => `₹${v}Cr`} />
              <Tooltip formatter={(v: any) => `₹${v} Cr`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <ChartCard title="Scenario Analysis" subtitle="Q3 & Q4 projections (₹ Cr)" csvData={forecastScenarios} delay={0.15}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastScenarios} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="scenario" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} tickFormatter={(v) => `₹${v}Cr`} />
              <Tooltip formatter={(v: any) => `₹${v} Cr`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="q3" name="Q3" radius={[6, 6, 0, 0]}>
                {forecastScenarios.map((s, i) => <Cell key={i} fill={scenarioColors[i]} />)}
              </Bar>
              <Bar dataKey="q4" name="Q4" radius={[6, 6, 0, 0]}>
                {forecastScenarios.map((s, i) => <Cell key={i} fill={scenarioColors[i]} fillOpacity={0.6} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card delay={0.2} className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-violet-600" />
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Forecast Drivers</h3>
        </div>
        <div className="space-y-3">
          {forecastDrivers.map((d, i) => (
            <motion.div key={d.driver} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">{d.driver}</span>
                  <span className={`text-xs font-semibold ${d.direction === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {d.direction === 'up' ? '+' : ''}{d.impact}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(d.impact) * 3}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    className={`h-full rounded-full ${d.direction === 'up' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'}`}
                  />
                </div>
              </div>
              {d.direction === 'up' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  </AppLayout>
);

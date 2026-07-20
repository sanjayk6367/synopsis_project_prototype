import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { Icon } from '../components/ui/Icon';
import { regionalBreakdown, statePerformance, regionCategoryMatrix, INR_CR } from '../data/mockData';
import { motion } from 'framer-motion';
import { BarChart, Bar, Treemap, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const stats = [
  { label: 'Top Region', value: 'South', icon: 'Trophy', color: 'from-amber-500 to-amber-600' },
  { label: 'Fastest Growth', value: '+18.6%', icon: 'Rocket', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Total States', value: '15', icon: 'Map', color: 'from-blue-500 to-blue-600' },
  { label: 'Avg Growth', value: '10.3%', icon: 'TrendingUp', color: 'from-violet-500 to-violet-600' },
];

const regionColors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const stateCols: Column<typeof statePerformance[number]>[] = [
  { key: 'state', label: 'State', sortable: true, render: (r) => <span className="font-medium">{r.state}</span> },
  { key: 'region', label: 'Region', render: (r) => <span className="chip bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">{r.region}</span> },
  { key: 'sales', label: 'Sales', align: 'right', sortable: true, render: (r) => INR_CR(r.sales) },
  { key: 'growth', label: 'Growth %', align: 'right', sortable: true, render: (r) => <span className={r.growth > 15 ? 'text-emerald-600 font-semibold' : ''}>+{r.growth}%</span> },
  { key: 'orders', label: 'Orders', align: 'right', sortable: true },
  { key: 'customers', label: 'Customers', align: 'right', sortable: true },
];

export const RegionalAnalytics = () => (
  <AppLayout title="Regional Analytics" actions={<ExportToolbar />}>
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
      <ChartCard title="Regional Performance" subtitle="Sales & profit by region" csvData={regionalBreakdown} delay={0.05} className="lg:col-span-2">
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalBreakdown} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => INR_CR(v)} width={56} />
              <Tooltip formatter={(v: any) => INR_CR(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Regional Sales Treemap" subtitle="Proportional view" csvData={regionalBreakdown} delay={0.1}>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap data={regionalBreakdown.map((r, i) => ({ name: r.region, size: r.sales, fill: regionColors[i] }))} dataKey="size" stroke="#fff" fill="#2563eb">
            </Treemap>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <Card delay={0.1} className="p-5">
        <h3 className="text-base font-semibold mb-4 text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Region Growth Comparison</h3>
        <div className="space-y-3">
          {regionalBreakdown.map((r, i) => {
            const max = Math.max(...regionalBreakdown.map(x => x.growth));
            const pct = (r.growth / max) * 100;
            return (
              <motion.div key={r.region} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">{r.region}</span>
                <div className="flex-1 h-2.5 rounded-full bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} className="h-full rounded-full" style={{ background: regionColors[i] }} />
                </div>
                <span className="text-xs font-semibold w-12 text-right text-emerald-600">+{r.growth}%</span>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <ChartCard title="Region × Category Matrix" subtitle="Sales distribution" csvData={regionCategoryMatrix} delay={0.15}>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionCategoryMatrix} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Electronics" stackId="a" fill="#2563eb" />
              <Bar dataKey="Furniture" stackId="a" fill="#10b981" />
              <Bar dataKey="Clothing" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Appliances" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="mt-5">
      <DataTable title="State-wise Performance" data={statePerformance} columns={stateCols} searchKeys={['state', 'region']} />
    </div>
  </AppLayout>
);

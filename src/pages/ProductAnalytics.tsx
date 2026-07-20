import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { KpiCards } from '../components/ui/KpiCards';
import { DataTable, Column } from '../components/ui/DataTable';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { Icon } from '../components/ui/Icon';
import { productPerformance, productVelocity, productMargins, inventoryTurnover, INR_CR, INR } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const stats = [
  { label: 'Active Products', value: '462', icon: 'Boxes', color: 'from-blue-500 to-blue-600' },
  { label: 'Units Sold', value: '18,240', icon: 'Package', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Avg Margin', value: '30%', icon: 'Percent', color: 'from-violet-500 to-violet-600' },
  { label: 'Return Rate', value: '2.6%', icon: 'RotateCcw', color: 'from-amber-500 to-amber-600' },
];

const marginCols: Column<typeof productMargins[number]>[] = [
  { key: 'name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', render: (r) => <span className="chip bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">{r.category}</span> },
  { key: 'margin', label: 'Margin %', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{r.margin}%</span> },
  { key: 'revenue', label: 'Revenue', align: 'right', sortable: true, render: (r) => INR_CR(r.revenue) },
];

const marginColors = (v: number) => v >= 30 ? '#10b981' : v >= 20 ? '#2563eb' : '#f59e0b';

export const ProductAnalytics = () => (
  <AppLayout title="Product Analytics" actions={<ExportToolbar />}>
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

    <KpiCards limit={6} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
      <ChartCard title="Product Performance by Category" subtitle="Units sold" csvData={productPerformance} delay={0.05}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productPerformance} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Bar dataKey="units" name="Units Sold" radius={[6, 6, 0, 0]}>
                {productPerformance.map((_, i) => <Cell key={i} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Product Velocity" subtitle="Monthly sales by category" csvData={productVelocity} delay={0.1}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productVelocity} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="electronics" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="clothing" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="appliances" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="furniture" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Margin vs Revenue" subtitle="Bubble: margin %" csvData={productMargins} delay={0.15}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 6, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis type="number" dataKey="revenue" name="Revenue" tickFormatter={(v) => INR_CR(v)} tick={{ fontSize: 10 }} />
              <YAxis type="number" dataKey="margin" name="Margin %" tick={{ fontSize: 11 }} width={40} />
              <ZAxis type="number" dataKey="margin" range={[60, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v: any, n: any) => n === 'revenue' ? INR_CR(Number(v)) : `${v}%`} />
              <Scatter data={productMargins}>
                {productMargins.map((p, i) => <Cell key={i} fill={marginColors(p.margin)} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Inventory Turnover" subtitle="Turnover ratio & days of stock" csvData={inventoryTurnover} delay={0.2}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryTurnover} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="turnover" name="Turnover Ratio" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="daysOfStock" name="Days of Stock" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="mt-5">
      <DataTable title="Product Margin Analysis" data={productMargins} columns={marginCols} searchKeys={['name', 'category']} />
    </div>
  </AppLayout>
);

import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { ChartCard } from '../components/ui/ChartCard';
import { KpiCards } from '../components/ui/KpiCards';
import { DataTable, Column } from '../components/ui/DataTable';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { customerSegments, customerAcquisition, customerRFM, customerLoyalty, INR_CR } from '../data/mockData';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Customers', value: '1,048', icon: 'Users', color: 'from-blue-500 to-blue-600' },
  { label: 'New This Month', value: '128', icon: 'UserPlus', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Retention Rate', value: '88.4%', icon: 'Heart', color: 'from-rose-500 to-rose-600' },
  { label: 'Avg LTV', value: '₹3.8L', icon: 'Gem', color: 'from-violet-500 to-violet-600' },
];

const rfmCols: Column<typeof customerRFM[number]>[] = [
  { key: 'segment', label: 'Segment', sortable: true, render: (r) => <span className="font-medium">{r.segment}</span> },
  { key: 'count', label: 'Customers', align: 'right', sortable: true },
  { key: 'recency', label: 'Recency (days)', align: 'right', sortable: true },
  { key: 'frequency', label: 'Frequency', align: 'right', sortable: true },
  { key: 'monetary', label: 'Monetary (₹L)', align: 'right', sortable: true, render: (r) => INR_CR(r.monetary * 100000) },
];

export const CustomerAnalytics = () => (
  <AppLayout title="Customer Analytics" actions={<ExportToolbar />}>
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
      <ChartCard title="Customer Segments" subtitle="Revenue by segment" csvData={customerSegments} delay={0.05}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={customerSegments} dataKey="revenue" nameKey="segment" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} label={(e: any) => `${e.segment}: ${INR_CR(e.revenue)}`} fontSize={10} labelLine={false}>
                {customerSegments.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => INR_CR(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Customer Acquisition vs Churn" subtitle="Monthly trend" csvData={customerAcquisition} delay={0.1}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerAcquisition} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="acq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                <linearGradient id="ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={2} fill="url(#acq)" />
              <Area type="monotone" dataKey="churned" name="Churned" stroke="#ef4444" strokeWidth={2} fill="url(#ch)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="RFM Segmentation" subtitle="Recency × Frequency × Monetary" csvData={customerRFM} delay={0.15}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={customerRFM}>
              <PolarGrid stroke="rgba(148,163,184,0.2)" />
              <PolarAngleAxis dataKey="segment" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} angle={90} />
              <Radar name="Frequency" dataKey="frequency" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
              <Radar name="Monetary" dataKey="monetary" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Loyalty Tier Distribution" subtitle="Customer count by tier" csvData={customerLoyalty} delay={0.2}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerLoyalty} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="tier" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="customers" name="Customers" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="retention" name="Retention %" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="mt-5">
      <DataTable title="RFM Segment Analysis" data={customerRFM} columns={rfmCols} searchKeys={['segment']} />
    </div>
  </AppLayout>
);

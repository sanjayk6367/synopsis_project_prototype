import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { Icon } from '../components/ui/Icon';
import { employeePerformance, employeeLeaderboard, employeeTrend, INR_CR } from '../data/mockData';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Medal, Award } from 'lucide-react';

const stats = [
  { label: 'Top Performer', value: 'Aarav Sharma', icon: 'Crown', color: 'from-amber-500 to-amber-600' },
  { label: 'Avg Achievement', value: '94.1%', icon: 'Target', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Total Reps', value: '48', icon: 'Users', color: 'from-blue-500 to-blue-600' },
  { label: 'Total Deals', value: '1,070', icon: 'Handshake', color: 'from-violet-500 to-violet-600' },
];

const rankIcon = (rank: number) => rank === 1 ? Trophy : rank === 2 ? Medal : rank === 3 ? Award : null;
const rankColor = (rank: number) => rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-navy-400' : rank === 3 ? 'text-orange-600' : 'text-navy-300';

const leaderboardCols: Column<typeof employeeLeaderboard[number]>[] = [
  { key: 'rank', label: 'Rank', align: 'center', sortable: true, render: (r) => {
    const I = rankIcon(r.rank);
    return <span className={`flex items-center justify-center gap-1 font-bold ${rankColor(r.rank)}`}>{I && <I size={14} />}{r.rank}</span>;
  } },
  { key: 'name', label: 'Employee', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: 'region', label: 'Region', render: (r) => <span className="chip bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">{r.region}</span> },
  { key: 'sales', label: 'Sales', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{INR_CR(r.sales)}</span> },
  { key: 'target', label: 'Target', align: 'right', sortable: true, render: (r) => INR_CR(r.target) },
  { key: 'deals', label: 'Deals', align: 'right', sortable: true },
  { key: 'rating', label: 'Rating', align: 'center', sortable: true, render: (r) => <span className="inline-flex items-center gap-1"><Award size={12} className="text-amber-500" />{r.rating}</span> },
];

const radialData = employeePerformance.slice(0, 5).map((e, i) => ({ name: e.name.split(' ')[0], achievement: e.achievement, fill: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i] }));

export const EmployeePerformance = () => (
  <AppLayout title="Employee Performance" actions={<ExportToolbar />}>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map((s, i) => (
        <Card key={s.label} delay={i * 0.05} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
              <Icon name={s.icon} size={20} />
            </div>
            <div>
              <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">{s.label}</p>
              <p className="text-lg font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50 truncate">{s.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Top 5 Achievement %" subtitle="Target achievement radial" csvData={radialData} delay={0.05} className="lg:col-span-1">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="25%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="achievement" cornerRadius={6} />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 10 }} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Sales vs Target" subtitle="By employee" csvData={employeePerformance} delay={0.1} className="lg:col-span-2">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeePerformance} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => INR_CR(v)} width={56} />
              <Tooltip formatter={(v: any) => INR_CR(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <ChartCard title="Monthly Trend" subtitle="Top 3 performers" csvData={employeeTrend} delay={0.15}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employeeTrend} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => INR_CR(v)} width={56} />
              <Tooltip formatter={(v: any) => INR_CR(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="Aarav Sharma" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Diya Patel" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Ananya Reddy" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card delay={0.2} className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={18} className="text-amber-500" />
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Leaderboard</h3>
        </div>
        <div className="space-y-2">
          {employeeLeaderboard.slice(0, 5).map((e, i) => {
            const I = rankIcon(e.rank);
            return (
              <motion.div key={e.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-700/40 theme-corporate:hover:bg-blue-800/40">
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${e.rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : 'bg-navy-100 dark:bg-navy-700/60 theme-corporate:bg-blue-800/60 text-navy-500'} font-bold text-sm`}>
                  {I ? <I size={16} /> : e.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100 truncate">{e.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">{e.region} · {e.deals} deals</p>
                </div>
                <span className="text-sm font-bold text-navy-900 dark:text-white theme-corporate:text-blue-50">{INR_CR(e.sales)}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>

    <div className="mt-5">
      <DataTable title="Employee Leaderboard" data={employeeLeaderboard} columns={leaderboardCols} searchKeys={['name', 'region']} />
    </div>
  </AppLayout>
);

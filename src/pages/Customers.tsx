import { AppLayout } from '../components/AppLayout';
import { DataTable, Column } from '../components/ui/DataTable';
import { tableCustomers, topCustomers, INR_CR, CUSTOMER_TYPES } from '../data/mockData';
import { CustomerGrowthChart } from '../components/charts/Charts';
import { Card } from '../components/ui/Card';
import { Users, UserCheck, Crown, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Customers', value: '1,048', icon: Users, color: 'from-blue-500 to-blue-600' },
  { label: 'Active This Month', value: '842', icon: UserCheck, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Enterprise Clients', value: '38', icon: Crown, color: 'from-amber-500 to-amber-600' },
  { label: 'Growth Rate', value: '+12.3%', icon: TrendingUp, color: 'from-violet-500 to-violet-600' },
];

const columns: Column<typeof tableCustomers[number]>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Customer', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City', sortable: true },
  { key: 'type', label: 'Type', render: (r) => <span className="chip bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300">{r.type}</span> },
  { key: 'orders', label: 'Orders', align: 'right', sortable: true },
  { key: 'spent', label: 'Spent', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{INR_CR(r.spent)}</span> },
];

export const Customers = () => (
  <AppLayout title="Customers">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map((s, i) => (
        <Card key={s.label} delay={i * 0.05} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-navy-500 dark:text-navy-400">{s.label}</p>
              <p className="text-xl font-bold text-navy-900 dark:text-white">{s.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <div className="mb-5"><CustomerGrowthChart /></div>

    <DataTable
      title="Customer Database"
      data={tableCustomers}
      columns={columns}
      searchKeys={['name', 'email', 'city', 'type']}
    />

    <div className="mt-5">
      <DataTable
        title="Top Valuable Customers"
        data={topCustomers}
        columns={[
          { key: 'name', label: 'Customer', sortable: true },
          { key: 'city', label: 'City', sortable: true },
          { key: 'orders', label: 'Orders', align: 'right', sortable: true },
          { key: 'spent', label: 'Total Spent', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{INR_CR(r.spent)}</span> },
          { key: 'type', label: 'Type', render: (r) => <span className="chip bg-primary-50 dark:bg-primary-600/15 text-primary-700 dark:text-primary-300">{r.type}</span> },
          { key: 'since', label: 'Since', sortable: true },
        ]}
        searchKeys={['name', 'city', 'type']}
      />
    </div>
  </AppLayout>
);

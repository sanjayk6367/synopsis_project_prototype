import { AppLayout } from '../components/AppLayout';
import { DataTable, Column } from '../components/ui/DataTable';
import { tableOrders, INR } from '../data/mockData';
import { DailySalesChart as DailyChart } from '../components/charts/Charts';
import { Card } from '../components/ui/Card';
import { ShoppingCart, CheckCircle2, Clock, XCircle } from 'lucide-react';

const stats = [
  { label: 'Total Orders', value: '5,240', icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
  { label: 'Delivered', value: '4,820', icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Processing', value: '284', icon: Clock, color: 'from-amber-500 to-amber-600' },
  { label: 'Cancelled', value: '136', icon: XCircle, color: 'from-rose-500 to-rose-600' },
];

const statusColor: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

const columns: Column<typeof tableOrders[number]>[] = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'product', label: 'Product' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'qty', label: 'Qty', align: 'right', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{INR(r.amount)}</span> },
  { key: 'payment', label: 'Payment', render: (r) => <span className="chip bg-navy-100 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200">{r.payment}</span> },
  { key: 'status', label: 'Status', render: (r) => <span className={`chip ${statusColor[r.status]}`}>{r.status}</span> },
];

export const Orders = () => (
  <AppLayout title="Orders">
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

    <div className="mb-5"><DailyChart /></div>

    <DataTable
      title="Recent Orders"
      data={tableOrders}
      columns={columns}
      searchKeys={['id', 'customer', 'product', 'status']}
    />
  </AppLayout>
);

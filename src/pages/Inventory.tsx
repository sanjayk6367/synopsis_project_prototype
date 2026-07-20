import { AppLayout } from '../components/AppLayout';
import { DataTable, Column } from '../components/ui/DataTable';
import { tableProducts, INR } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { Boxes, PackageCheck, AlertTriangle, Warehouse } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Stock Units', value: '12,480', icon: Boxes, color: 'from-blue-500 to-blue-600' },
  { label: 'In-Stock Products', value: '462', icon: PackageCheck, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Low Stock Alerts', value: '24', icon: AlertTriangle, color: 'from-amber-500 to-amber-600' },
  { label: 'Warehouses', value: '8', icon: Warehouse, color: 'from-violet-500 to-violet-600' },
];

const inventory = tableProducts.map(p => ({
  ...p,
  status: p.stock < 200 ? 'Low' : p.stock < 400 ? 'Medium' : 'High',
  value: p.stock * p.price,
  reorder: p.stock < 200,
}));

const statusColor: Record<string, string> = {
  High: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Low: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

const columns: Column<typeof inventory[number]>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Unit Price', align: 'right', sortable: true, render: (r) => INR(r.price) },
  { key: 'stock', label: 'Stock', align: 'right', sortable: true, render: (r) => <span className={r.reorder ? 'text-rose-500 font-semibold' : ''}>{r.stock}</span> },
  { key: 'value', label: 'Stock Value', align: 'right', sortable: true, render: (r) => <span className="font-semibold">{INR(r.value)}</span> },
  { key: 'status', label: 'Status', render: (r) => <span className={`chip ${statusColor[r.status]}`}>{r.status}</span> },
  { key: 'reorder', label: 'Reorder', align: 'center', render: (r) => r.reorder ? <span className="chip bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">Yes</span> : <span className="text-navy-400">—</span> },
];

export const Inventory = () => (
  <AppLayout title="Inventory">
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

    <Card delay={0.1} className="p-4 mb-5">
      <h3 className="text-base font-semibold mb-3 text-navy-900 dark:text-navy-100">Stock Value by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {['Electronics', 'Furniture', 'Clothing', 'Home Appliances', 'Sports', 'Books'].map((cat, i) => {
          const vals = [38.4, 14.2, 6.8, 18.6, 8.4, 4.2];
          return (
            <motion.div key={cat} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-xl bg-navy-50 dark:bg-navy-700/30">
              <p className="text-xs text-navy-500 dark:text-navy-400">{cat}</p>
              <p className="text-lg font-bold text-navy-900 dark:text-white">₹{vals[i]}L</p>
              <div className="h-1.5 mt-2 rounded-full bg-navy-200 dark:bg-navy-600 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${vals[i] * 2.4}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>

    <DataTable
      title="Inventory Management"
      data={inventory}
      columns={columns}
      searchKeys={['name', 'category', 'id']}
    />
  </AppLayout>
);

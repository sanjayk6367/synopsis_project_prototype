import { AppLayout } from '../components/AppLayout';
import { DataTable, Column } from '../components/ui/DataTable';
import { tableProducts, INR, CATEGORIES } from '../data/mockData';
import { RevenueByCategoryChart, TopProductsChart } from '../components/charts/Charts';
import { Card } from '../components/ui/Card';
import { Package, Boxes, Star, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Products', value: '500', icon: Package, color: 'from-blue-500 to-blue-600' },
  { label: 'In Stock', value: '12,480', icon: Boxes, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Avg Rating', value: '4.5', icon: Star, color: 'from-amber-500 to-amber-600' },
  { label: 'Units Sold', value: '18,240', icon: TrendingUp, color: 'from-violet-500 to-violet-600' },
];

const columns: Column<typeof tableProducts[number]>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', render: (r) => <span className="chip bg-navy-100 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200">{r.category}</span> },
  { key: 'price', label: 'Price', align: 'right', sortable: true, render: (r) => INR(r.price) },
  { key: 'stock', label: 'Stock', align: 'right', sortable: true, render: (r) => <span className={r.stock < 200 ? 'text-rose-500 font-semibold' : ''}>{r.stock}</span> },
  { key: 'sold', label: 'Sold', align: 'right', sortable: true },
  { key: 'rating', label: 'Rating', align: 'center', sortable: true, render: (r) => <span className="inline-flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" />{r.rating}</span> },
];

export const Products = () => (
  <AppLayout title="Products">
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

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <RevenueByCategoryChart />
      <TopProductsChart />
    </div>

    <DataTable
      title="Product Catalog"
      data={tableProducts}
      columns={columns}
      searchKeys={['name', 'category', 'id']}
    />
  </AppLayout>
);

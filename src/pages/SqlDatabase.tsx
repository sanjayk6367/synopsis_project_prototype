import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { DataTable, Column } from '../components/ui/DataTable';
import { tableCustomers, tableProducts, tableOrders, tableSales, tableEmployees, INR, INR_CR } from '../data/mockData';
import { Database, Table2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TableName = 'customers' | 'products' | 'orders' | 'sales' | 'employees';

const tables: { key: TableName; label: string; icon: string; rows: number }[] = [
  { key: 'customers', label: 'Customers', icon: 'Users', rows: 1000 },
  { key: 'products', label: 'Products', icon: 'Package', rows: 500 },
  { key: 'orders', label: 'Orders', icon: 'ShoppingCart', rows: 5240 },
  { key: 'sales', label: 'Sales', icon: 'IndianRupee', rows: 5240 },
  { key: 'employees', label: 'Employees', icon: 'Users', rows: 48 },
];

const customerCols: Column<typeof tableCustomers[number]>[] = [
  { key: 'id', label: 'CustomerID', sortable: true },
  { key: 'name', label: 'CustomerName', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City', sortable: true },
  { key: 'type', label: 'CustomerType' },
  { key: 'orders', label: 'Orders', align: 'right', sortable: true },
  { key: 'spent', label: 'TotalSpent', align: 'right', sortable: true, render: (r) => INR_CR(r.spent) },
];

const productCols: Column<typeof tableProducts[number]>[] = [
  { key: 'id', label: 'ProductID', sortable: true },
  { key: 'name', label: 'ProductName', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', align: 'right', sortable: true, render: (r) => INR(r.price) },
  { key: 'stock', label: 'Stock', align: 'right', sortable: true },
  { key: 'sold', label: 'UnitsSold', align: 'right', sortable: true },
  { key: 'rating', label: 'Rating', align: 'center', sortable: true },
];

const orderCols: Column<typeof tableOrders[number]>[] = [
  { key: 'id', label: 'OrderID', sortable: true },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'date', label: 'OrderDate', sortable: true },
  { key: 'qty', label: 'Quantity', align: 'right', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => INR(r.amount) },
  { key: 'payment', label: 'PaymentMethod' },
  { key: 'status', label: 'Status' },
];

const salesCols: Column<typeof tableSales[number]>[] = [
  { key: 'id', label: 'SaleID', sortable: true },
  { key: 'orderId', label: 'OrderID' },
  { key: 'rep', label: 'SalesRep' },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => INR(r.amount) },
  { key: 'commission', label: 'Commission', align: 'right', render: (r) => INR(r.commission) },
  { key: 'date', label: 'SaleDate', sortable: true },
];

const employeeCols: Column<typeof tableEmployees[number]>[] = [
  { key: 'id', label: 'EmployeeID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'region', label: 'Region' },
  { key: 'manager', label: 'Manager' },
  { key: 'sales', label: 'Sales', align: 'right', sortable: true, render: (r) => INR_CR(r.sales) },
  { key: 'rating', label: 'Rating', align: 'center', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true },
];

const tableConfig: Record<TableName, { data: any[]; cols: Column<any>[]; searchKeys: string[] }> = {
  customers: { data: tableCustomers, cols: customerCols, searchKeys: ['id', 'name', 'email', 'city', 'type'] },
  products: { data: tableProducts, cols: productCols, searchKeys: ['id', 'name', 'category'] },
  orders: { data: tableOrders, cols: orderCols, searchKeys: ['id', 'customer', 'product', 'status'] },
  sales: { data: tableSales, cols: salesCols, searchKeys: ['id', 'orderId', 'rep', 'region'] },
  employees: { data: tableEmployees, cols: employeeCols, searchKeys: ['id', 'name', 'role', 'region'] },
};

export const SqlDatabase = () => {
  const [active, setActive] = useState<TableName>('customers');
  const cfg = tableConfig[active];

  return (
    <AppLayout title="SQL Database Module">
      <div className="card p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Database size={18} className="text-primary-600" />
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">Database Tables · SalesAnalyticsDB</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tables.map((t, i) => (
            <motion.button
              key={t.key}
              onClick={() => setActive(t.key)}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className={`p-3 rounded-xl border text-left transition-colors ${active === t.key ? 'bg-primary-50 dark:bg-primary-600/15 border-primary-300 dark:border-primary-600' : 'bg-navy-50 dark:bg-navy-700/30 border-navy-100 dark:border-navy-700/50 hover:border-primary-200'}`}
            >
              <div className="flex items-center justify-between">
                <Table2 size={16} className={active === t.key ? 'text-primary-600' : 'text-navy-500'} />
                <span className="text-[10px] text-navy-400">{t.rows} rows</span>
              </div>
              <p className={`mt-2 text-sm font-semibold ${active === t.key ? 'text-primary-700 dark:text-primary-300' : 'text-navy-800 dark:text-navy-100'}`}>{t.label}</p>
              <p className="text-[10px] text-navy-400 font-mono">dbo.{t.key}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
        >
          <DataTable
            title={`dbo.${active}`}
            data={cfg.data}
            columns={cfg.cols}
            searchKeys={cfg.searchKeys as any}
            pageSize={10}
          />
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
};

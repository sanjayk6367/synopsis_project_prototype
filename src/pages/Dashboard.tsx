import { AppLayout } from '../components/AppLayout';
import { FilterBar } from '../components/FilterBar';
import { KpiCards } from '../components/ui/KpiCards';
import {
  MonthlySalesChart, RevenueByCategoryChart, SalesByRegionChart, ProfitDonutChart,
  TopProductsChart, RevenueVsProfitChart, DailySalesChart, SalesForecastChart, CustomerGrowthChart,
} from '../components/charts/Charts';
import { topCustomers, INR_CR } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { ExportToolbar } from '../components/ui/ExportToolbar';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export const Dashboard = () => (
  <AppLayout title="Dashboard" banner actions={<ExportToolbar />}>
    <FilterBar />
    <KpiCards />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <div className="lg:col-span-2"><MonthlySalesChart /></div>
      <ProfitDonutChart />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <RevenueByCategoryChart />
      <SalesByRegionChart />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <RevenueVsProfitChart />
      <TopProductsChart />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <DailySalesChart />
      <SalesForecastChart />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      <CustomerGrowthChart />
      <div className="lg:col-span-2">
        <Card delay={0.1} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={18} className="text-amber-500" />
            <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Top Customers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 border-b border-navy-100 dark:border-navy-700/60 theme-corporate:border-blue-700/40">
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2 text-right">Orders</th>
                  <th className="px-3 py-2 text-right">Spent</th>
                  <th className="px-3 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <motion.tr
                    key={c.name}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-navy-50 dark:border-navy-700/30 theme-corporate:border-blue-800/30 hover:bg-primary-50/40 dark:hover:bg-primary-600/10 theme-corporate:hover:bg-blue-800/40"
                  >
                    <td className="px-3 py-2.5 font-medium text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100">{c.name}</td>
                    <td className="px-3 py-2.5 text-navy-600 dark:text-navy-300 theme-corporate:text-blue-200">{c.city}</td>
                    <td className="px-3 py-2.5 text-right">{c.orders}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{INR_CR(c.spent)}</td>
                    <td className="px-3 py-2.5">
                      <span className="chip bg-primary-50 dark:bg-primary-600/15 theme-corporate:bg-blue-700/40 text-primary-700 dark:text-primary-300 theme-corporate:text-blue-100">{c.type}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
);

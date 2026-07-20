import { AppLayout } from '../components/AppLayout';
import { FilterBar } from '../components/FilterBar';
import {
  MonthlySalesChart, RevenueByCategoryChart, SalesByRegionChart, ProfitDonutChart,
  TopProductsChart, RevenueVsProfitChart, DailySalesChart, SalesForecastChart,
} from '../components/charts/Charts';
import { KpiCards } from '../components/ui/KpiCards';

export const SalesAnalytics = () => (
  <AppLayout title="Sales Analytics">
    <FilterBar />
    <KpiCards />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
      <MonthlySalesChart />
      <RevenueByCategoryChart />
      <SalesByRegionChart />
      <ProfitDonutChart />
      <TopProductsChart />
      <RevenueVsProfitChart />
      <DailySalesChart />
      <SalesForecastChart />
    </div>
  </AppLayout>
);

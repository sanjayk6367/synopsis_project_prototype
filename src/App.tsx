import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FilterProvider } from './context/FilterContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { CustomerAnalytics } from './pages/CustomerAnalytics';
import { ProductAnalytics } from './pages/ProductAnalytics';
import { RegionalAnalytics } from './pages/RegionalAnalytics';
import { EmployeePerformance } from './pages/EmployeePerformance';
import { SalesForecast } from './pages/SalesForecast';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { BusinessInsights } from './pages/BusinessInsights';
import { SqlDatabase } from './pages/SqlDatabase';
import { SqlQuery } from './pages/SqlQuery';
import { About } from './pages/About';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app">
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sales" element={<SalesAnalytics />} />
              <Route path="customer-analytics" element={<CustomerAnalytics />} />
              <Route path="product-analytics" element={<ProductAnalytics />} />
              <Route path="regional-analytics" element={<RegionalAnalytics />} />
              <Route path="employees" element={<EmployeePerformance />} />
              <Route path="forecast" element={<SalesForecast />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="insights" element={<BusinessInsights />} />
              <Route path="database" element={<SqlDatabase />} />
              <Route path="query" element={<SqlQuery />} />
              <Route path="about" element={<About />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </ThemeProvider>
  );
}

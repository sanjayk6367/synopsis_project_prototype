import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  monthlySalesTrend, revenueByCategory, profitDistribution, topProducts,
  revenueVsProfit, dailySales, salesForecast, customerGrowth, salesByRegion, INR_CR,
} from '../../data/mockData';
import { ChartCard } from '../ui/ChartCard';
import { useFilters } from '../../context/FilterContext';
import { motion } from 'framer-motion';

const axisStyle = { fontSize: 11 };
const gridProps = { strokeDasharray: '3 3', stroke: 'rgba(148,163,184,0.2)' };

const TooltipFormatter = (v: any) => INR_CR(Number(v));

// 1. Monthly Sales Trend
export const MonthlySalesChart = () => (
  <ChartCard title="Monthly Sales Trend" subtitle="5-year comparison (₹)" delay={0.05}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlySalesTrend} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} width={56} />
          <Tooltip formatter={TooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {['2021', '2022', '2023', '2024', '2025'].map((y, i) => (
            <Line key={y} type="monotone" dataKey={y} stroke={['#94a3b8', '#60a5fa', '#3b82f6', '#2563eb', '#1e3a8a'][i]} strokeWidth={i === 4 ? 3 : 2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 2. Revenue by Category (Bar)
export const RevenueByCategoryChart = () => (
  <ChartCard title="Revenue by Category" subtitle="Electronics, Furniture, Clothing & more" delay={0.1}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueByCategory} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="category" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} width={56} />
          <Tooltip formatter={TooltipFormatter} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 3. Sales by Region (India map representation)
export const SalesByRegionChart = () => {
  const { filters } = useFilters();
  const regionData = salesByRegion;
  const max = Math.max(...regionData.map(r => r.sales));

  return (
    <ChartCard title="Sales by Region" subtitle="Indian regional distribution" delay={0.15}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="relative h-[240px] flex items-center justify-center">
          <svg viewBox="0 0 200 220" className="w-full h-full max-w-[260px]">
            {/* Stylized India map zones */}
            <defs>
              <linearGradient id="indiaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
              d="M70 20 L120 18 L140 40 L150 70 L160 110 L150 150 L130 180 L110 200 L95 210 L85 195 L75 170 L60 140 L50 100 L55 60 Z"
              fill="url(#indiaGrad)" stroke="#1e40af" strokeWidth="1.5" opacity="0.85"
              style={{ transformOrigin: 'center' }}
            />
            {[
              { x: 95, y: 60, label: 'N' }, { x: 110, y: 130, label: 'S' },
              { x: 130, y: 90, label: 'E' }, { x: 70, y: 95, label: 'W' },
              { x: 100, y: 100, label: 'C' },
            ].map((pt, i) => (
              <motion.circle
                key={i} cx={pt.x} cy={pt.y} r="6" fill="#fff" stroke="#1e3a8a" strokeWidth="1.5"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
              />
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          {regionData.map((r, i) => {
            const pct = (r.sales / max) * 100;
            return (
              <motion.div
                key={r.region}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="w-16 text-xs font-medium text-navy-700 dark:text-navy-200">{r.region}</span>
                <div className="flex-1 h-2.5 rounded-full bg-navy-100 dark:bg-navy-700/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                  />
                </div>
                <span className="text-xs font-semibold text-navy-800 dark:text-navy-100 w-16 text-right">{INR_CR(r.sales)}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
};

// 4. Profit Distribution (Donut)
export const ProfitDonutChart = () => (
  <ChartCard title="Profit Distribution" subtitle="Share by category" delay={0.2}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={profitDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%" cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            animationDuration={900}
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={false}
            fontSize={10}
          >
            {profitDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 5. Top Products (Horizontal Bar)
export const TopProductsChart = () => (
  <ChartCard title="Top Products" subtitle="By revenue (₹)" delay={0.25}>
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={topProducts} margin={{ top: 6, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid {...gridProps} horizontal={false} />
          <XAxis type="number" tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} />
          <YAxis type="category" dataKey="name" tick={axisStyle} stroke="#94a3b8" width={140} />
          <Tooltip formatter={TooltipFormatter} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 6, 6, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 6. Revenue vs Profit (Area)
export const RevenueVsProfitChart = () => (
  <ChartCard title="Revenue vs Profit" subtitle="Monthly comparison" delay={0.3}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueVsProfit} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} width={56} />
          <Tooltip formatter={TooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#rev)" animationDuration={900} />
          <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#prof)" animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 7. Daily Sales (Column)
export const DailySalesChart = () => (
  <ChartCard title="Daily Sales" subtitle="Last 14 days vs target" delay={0.35}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailySales} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} width={56} />
          <Tooltip formatter={TooltipFormatter} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} animationDuration={900} />
          <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 8. Sales Forecast
export const SalesForecastChart = () => (
  <ChartCard title="Sales Forecast" subtitle="ML prediction for next quarters" delay={0.4}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesForecast} margin={{ top: 6, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" tickFormatter={TooltipFormatter} width={56} />
          <Tooltip formatter={TooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
          <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// 9. Customer Growth (Area)
export const CustomerGrowthChart = () => (
  <ChartCard title="Customer Growth" subtitle="Total vs active customers" delay={0.45}>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={customerGrowth} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="cust" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="act" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" tick={axisStyle} stroke="#94a3b8" />
          <YAxis tick={axisStyle} stroke="#94a3b8" width={40} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="customers" stroke="#06b6d4" strokeWidth={2} fill="url(#cust)" animationDuration={900} />
          <Area type="monotone" dataKey="active" stroke="#8b5cf6" strokeWidth={2} fill="url(#act)" animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);

// Deterministic Indian sales dataset generator.
// Produces 1000 customers, 500 products, 5000 orders across 2021-2025.
// All dashboard aggregates are derived from this single source of truth.

import {
  STATES, CITIES, CITY_STATE, REGIONS, regionOf, CATEGORIES,
  PAYMENT_METHODS, CUSTOMER_TYPES, MONTHS, YEARS,
} from './constants';

// ---------- Deterministic PRNG (mulberry32) ----------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20250719);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
const intIn = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------- Types ----------
export interface Customer {
  id: string; name: string; email: string; phone: string;
  city: string; state: string; type: string; since: number;
}
export interface Product {
  id: string; name: string; category: string; cost: number; price: number; stock: number;
}
export interface Order {
  id: string; customerId: string; customerName: string; productId: string; productName: string;
  category: string; date: string; year: number; month: number; qty: number;
  amount: number; cost: number; profit: number; city: string; state: string; region: string;
  payment: string; status: string; salesRep: string;
}

// ---------- Name pools ----------
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan',
  'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kiara', 'Pari', 'Myra', 'Anika', 'Navya', 'Aarohi',
  'Kabir', 'Aryan', 'Dhruv', 'Karan', 'Nikhil', 'Rahul', 'Sneha', 'Pooja', 'Neha', 'Priya'];
const LAST_NAMES = ['Sharma', 'Patel', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Rao', 'Mehta', 'Singh', 'Das',
  'Kumar', 'Verma', 'Joshi', 'Bose', 'Pillai', 'Menon', 'Shah', 'Desai', 'Kapoor', 'Malhotra'];
const COMPANY_SUFFIX = ['Retail Ltd', 'Enterprises', 'Traders Pvt Ltd', 'Wholesale', 'Stores', 'Mart', 'Suppliers', 'Distributors'];
const PRODUCT_NAMES: Record<string, string[]> = {
  Electronics: ['Samsung Smart TV', 'Apple iPhone', 'HP Laptop', 'Sony Headphones', 'LG Refrigerator', 'Boat Speaker', 'Mi Phone', 'Dell Monitor', 'Logitech Mouse', 'Canon Camera'],
  Furniture: ['Wooden Office Chair', 'Steel Almirah', 'Sofa Set', 'Dining Table', 'Bookshelf', 'Plastic Stool', 'Cot Bed', 'Office Desk', 'Wardrobe', 'Coffee Table'],
  Grocery: ['Basmati Rice 5kg', 'Sunflower Oil 1L', 'Wheat Atta 10kg', 'Toor Dal 1kg', 'Sugar 1kg', 'Tea 500g', 'Coffee 200g', 'Spice Mix 200g', 'Salt 1kg', 'Detergent 1kg'],
  Clothing: ['Cotton Casual Shirt', 'Denim Jeans', 'Saree Silk', 'Kurta Pajama', 'T-Shirt', 'Formal Trousers', 'Anarkali Dress', 'Winter Jacket', 'Track Pants', 'Ethnic Top'],
  Sports: ['Nike Running Shoes', 'Yoga Mat', 'Cricket Bat', 'Football', 'Badminton Racket', 'Gym Gloves', 'Treadmill', 'Dumbbell Set', 'Skipping Rope', 'Cycling Helmet'],
};

const REPS = [
  'Aarav Sharma', 'Diya Patel', 'Vivaan Iyer', 'Ananya Reddy', 'Arjun Nair',
  'Ishaan Gupta', 'Saanvi Rao', 'Aditya Mehta', 'Kiya Singh', 'Reyansh Das',
];
const ORDER_STATUS = ['Delivered', 'Shipped', 'Processing', 'Cancelled', 'Returned'];

// ---------- Generate Customers ----------
function generateCustomers(n: number): Customer[] {
  const out: Customer[] = [];
  for (let i = 0; i < n; i++) {
    const city = pick(CITIES);
    const state = CITY_STATE[city];
    const isCompany = rnd() > 0.78;
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const name = isCompany ? `${first} ${pick(COMPANY_SUFFIX)}` : `${first} ${last}`;
    const id = 'C' + String(1001 + i);
    out.push({
      id,
      name,
      email: `${name.split(' ')[0].toLowerCase()}.${id.toLowerCase()}@mail.co.in`,
      phone: `+91 ${intIn(70, 99)}${intIn(100, 999)} ${intIn(10000, 99999)}`,
      city, state,
      type: isCompany ? pick(['Corporate', 'Enterprise']) : pick(['Retail', 'Wholesale']),
      since: pick(YEARS.filter(y => y < 2025)),
    });
  }
  return out;
}

// ---------- Generate Products ----------
function generateProducts(n: number): Product[] {
  const out: Product[] = [];
  for (let i = 0; i < n; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const baseNames = PRODUCT_NAMES[category];
    const variant = Math.floor(i / CATEGORIES.length) + 1;
    const name = `${baseNames[i % baseNames.length]}${variant > 1 ? ` v${variant}` : ''}`;
    const cost = intIn(200, 60000);
    const price = Math.round(cost * (1.18 + rnd() * 0.4));
    out.push({
      id: 'P' + String(501 + i),
      name, category,
      cost, price,
      stock: intIn(40, 1200),
    });
  }
  return out;
}

// ---------- Generate Orders ----------
function generateOrders(n: number, customers: Customer[], products: Product[]): Order[] {
  const out: Order[] = [];
  for (let i = 0; i < n; i++) {
    const cust = pick(customers);
    const prod = pick(products);
    const year = pick(YEARS);
    const month = intIn(1, 12);
    const day = intIn(1, 28);
    const qty = intIn(1, 24);
    const amount = prod.price * qty;
    const cost = prod.cost * qty;
    const profit = amount - cost;
    const status = pick(ORDER_STATUS);
    out.push({
      id: 'ORD-' + String(24001 + i),
      customerId: cust.id,
      customerName: cust.name,
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      year, month, qty,
      amount, cost, profit,
      city: cust.city,
      state: cust.state,
      region: regionOf(cust.state),
      payment: pick(PAYMENT_METHODS),
      status,
      salesRep: pick(REPS),
    });
  }
  return out;
}

// ---------- Build the dataset ----------
export const customers = generateCustomers(1000);
export const products = generateProducts(500);
export const orders = generateOrders(5000, customers, products);

// ---------- Derived aggregates (single source of truth) ----------
export const totalSales = orders.reduce((s, o) => s + o.amount, 0);
export const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
export const totalProfit = orders.reduce((s, o) => s + o.profit, 0);
export const totalOrders = orders.length;
export const totalCustomers = customers.length;
export const totalProducts = products.length;
export const activeProducts = products.filter(p => p.stock > 100).length;
export const avgOrderValue = Math.round(totalRevenue / totalOrders);
export const profitMargin = round2((totalProfit / totalRevenue) * 100);
export const returnRate = round2((orders.filter(o => o.status === 'Returned').length / totalOrders) * 100);
export const cancelledRate = round2((orders.filter(o => o.status === 'Cancelled').length / totalOrders) * 100);
export const conversionRate = round2(68 + (totalOrders % 100) / 100);

// Customer satisfaction (simulated, weighted by delivered share)
const deliveredShare = orders.filter(o => o.status === 'Delivered').length / totalOrders;
export const customerSatisfaction = round2(4 + deliveredShare * 0.8);

// YoY growth (2025 vs 2024 revenue)
const revByYear = (y: number) => orders.filter(o => o.year === y && o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
export const yoyGrowth = round2(((revByYear(2025) - revByYear(2024)) / revByYear(2024)) * 100);

// ---------- Monthly sales trend (by year) ----------
export const monthlySalesTrend = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const row: Record<string, number | string> = { month: m };
  YEARS.forEach(y => {
    row[String(y)] = orders
      .filter(o => o.year === y && o.month === monthNum && o.status !== 'Cancelled')
      .reduce((s, o) => s + o.amount, 0);
  });
  return row;
});

// ---------- Revenue & Profit by Category ----------
export const revenueByCategory = CATEGORIES.map(c => {
  const catOrders = orders.filter(o => o.category === c);
  return {
    category: c,
    revenue: catOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
    profit: catOrders.reduce((s, o) => s + o.profit, 0),
    units: catOrders.reduce((s, o) => s + o.qty, 0),
  };
});

// ---------- Sales by Region ----------
export const salesByRegion = REGIONS.map(r => {
  const rOrders = orders.filter(o => o.region === r);
  return {
    region: r,
    sales: rOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
    orders: rOrders.length,
    customers: new Set(rOrders.map(o => o.customerId)).size,
    growth: round2(4 + (rOrders.length % 40) / 4),
  };
});

// ---------- Profit distribution (donut) ----------
const totalCatProfit = revenueByCategory.reduce((s, c) => s + c.profit, 0);
const donutColors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
export const profitDistribution = revenueByCategory.map((c, i) => ({
  name: c.category,
  value: Math.round((c.profit / totalCatProfit) * 100),
  color: donutColors[i % donutColors.length],
}));

// ---------- Top products (by revenue) ----------
export const topProducts = Object.values(
  orders.reduce((acc, o) => {
    if (o.status === 'Cancelled') return acc;
    const k = o.productName;
    if (!acc[k]) acc[k] = { name: k, sales: 0, units: 0 };
    acc[k].sales += o.amount;
    acc[k].units += o.qty;
    return acc;
  }, {} as Record<string, { name: string; sales: number; units: number }>)
)
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 8);

// ---------- Revenue vs Profit (monthly, all years combined) ----------
export const revenueVsProfit = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const mOrders = orders.filter(o => o.month === monthNum);
  return {
    month: m,
    revenue: mOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
    profit: mOrders.reduce((s, o) => s + o.profit, 0),
  };
});

// ---------- Daily sales (last 14 days of dataset) ----------
const sortedDates = [...new Set(orders.map(o => o.date))].sort();
const lastDates = sortedDates.slice(-14);
export const dailySales = lastDates.map((d, i) => {
  const dOrders = orders.filter(o => o.date === d);
  const sales = dOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
  return {
    day: `D${i + 1}`,
    sales,
    target: Math.round(sales * (1.08 + (i % 5) * 0.01)),
  };
});

// ---------- Sales forecast (12 actual + 6 forecast) ----------
const lastYearMonthly = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  return orders.filter(o => o.year === 2025 && o.month === monthNum && o.status !== 'Cancelled')
    .reduce((s, o) => s + o.amount, 0);
});
export const salesForecast = MONTHS.map((m, i) => ({
  month: m,
  actual: lastYearMonthly[i] || null,
  forecast: null as number | null,
})).concat(MONTHS.slice(0, 6).map((m, i) => ({
  month: `F-${m}`,
  actual: null,
  forecast: Math.round((lastYearMonthly[i] || 0) * (1.15 + i * 0.03)),
})) as any);

// ---------- Customer growth (cumulative customers by month, 2025) ----------
const customersByMonth2025 = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const active = new Set(
    orders.filter(o => o.month <= monthNum).map(o => o.customerId)
  ).size;
  return {
    month: m,
    customers: active,
    active: Math.round(active * (0.62 + i * 0.012)),
  };
});
export const customerGrowth = customersByMonth2025;

// ---------- Top customers (by spend) ----------
export const topCustomers = Object.values(
  orders.reduce((acc, o) => {
    if (o.status === 'Cancelled') return acc;
    const k = o.customerId;
    if (!acc[k]) acc[k] = { id: k, name: o.customerName, city: o.city, orders: 0, spent: 0, type: 'Retail', since: '2021' };
    acc[k].orders += 1;
    acc[k].spent += o.amount;
    return acc;
  }, {} as Record<string, any>)
)
  .map((c: any) => {
    const cust = customers.find(x => x.id === c.id);
    return { ...c, type: cust?.type ?? 'Retail', since: String(cust?.since ?? 2021) };
  })
  .sort((a, b) => b.spent - a.spent)
  .slice(0, 8);

// ---------- Business insights (derived) ----------
const topCat = [...revenueByCategory].sort((a, b) => b.profit - a.profit)[0];
const topProd = topProducts[0];
const topCust = topCustomers[0];
const topReg = [...salesByRegion].sort((a, b) => b.growth - a.growth)[0];
const lowMarginCat = [...revenueByCategory].sort((a, b) => a.profit - b.profit)[0];

export const businessInsights = [
  { title: 'Highest Selling Product', value: topProd.name, trend: `+${yoyGrowth}%`, up: true, icon: 'Crown', color: 'from-amber-400 to-amber-600', desc: `${topProd.units} units sold across all regions` },
  { title: 'Highest Profit Category', value: topCat.category, trend: `+${profitMargin}%`, up: true, icon: 'Award', color: 'from-emerald-400 to-emerald-600', desc: `${Math.round((topCat.profit / totalCatProfit) * 100)}% of total profit contribution` },
  { title: 'Most Valuable Customer', value: topCust.name, trend: `₹${(topCust.spent / 1e7).toFixed(2)} Cr`, up: true, icon: 'Gem', color: 'from-violet-400 to-violet-600', desc: `${topCust.orders} orders since ${topCust.since}` },
  { title: 'Fastest Growing Region', value: `${topReg.region} India`, trend: `+${topReg.growth}%`, up: true, icon: 'Rocket', color: 'from-blue-400 to-blue-600', desc: `${topReg.orders} orders, ${topReg.customers} customers` },
  { title: 'Lowest Performing Category', value: lowMarginCat.category, trend: `${lowMarginCat.profit > 0 ? '+' : ''}₹${(lowMarginCat.profit / 1e7).toFixed(2)} Cr`, up: lowMarginCat.profit > 0, icon: 'TrendingDown', color: 'from-rose-400 to-rose-600', desc: 'Lowest profit contribution — review pricing' },
  { title: 'Monthly Growth Rate', value: `${yoyGrowth}%`, trend: 'YoY', up: yoyGrowth > 0, icon: 'Activity', color: 'from-cyan-400 to-cyan-600', desc: 'Year-over-year revenue acceleration' },
  { title: 'Annual Growth', value: `${yoyGrowth}%`, trend: 'YoY', up: yoyGrowth > 0, icon: 'BarChart3', color: 'from-indigo-400 to-indigo-600', desc: '2025 vs 2024 fiscal year' },
  { title: 'Revenue Forecast', value: `₹${(revByYear(2025) * 1.18 / 1e7).toFixed(1)} Cr`, trend: 'Q4 2025', up: true, icon: 'LineChart', color: 'from-teal-400 to-teal-600', desc: 'Projection based on current run-rate' },
  { title: 'Recommendation', value: `Boost ${topCat.category} inventory`, trend: 'Action', up: true, icon: 'Lightbulb', color: 'from-orange-400 to-orange-600', desc: 'High margin category — increase stock allocation' },
];

// ---------- SQL table snapshots (first 10 rows each) ----------
export const tableCustomers = customers.slice(0, 10).map(c => ({
  id: c.id, name: c.name, email: c.email, phone: c.phone, city: c.city,
  type: c.type, orders: orders.filter(o => o.customerId === c.id).length,
  spent: orders.filter(o => o.customerId === c.id && o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
}));

export const tableProducts = products.slice(0, 10).map(p => ({
  id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock,
  sold: orders.filter(o => o.productId === p.id).reduce((s, o) => s + o.qty, 0),
  rating: round2(3.8 + (p.price % 12) / 10),
}));

export const tableOrders = orders.slice(0, 10).map(o => ({
  id: o.id, customer: o.customerName, product: o.productName, date: o.date,
  qty: o.qty, amount: o.amount, status: o.status, payment: o.payment,
}));

export const tableSales = orders.slice(0, 8).map((o, i) => ({
  id: 'S' + String(9001 + i), orderId: o.id, rep: o.salesRep, region: o.region,
  amount: o.amount, commission: Math.round(o.amount * 0.03), date: o.date,
}));

export const tableEmployees = REPS.map((name, i) => {
  const repOrders = orders.filter(o => o.salesRep === name);
  const sales = repOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
  const region = repOrders[0]?.region ?? pick(REGIONS as readonly string[]);
  return {
    id: 'E' + String(201 + i), name, role: i < 4 ? 'Senior Sales Rep' : 'Sales Rep',
    region, manager: 'Rohan Kapoor', sales, rating: round2(4 + (i % 5) * 0.12), joined: pick([2018, 2019, 2020, 2021, 2022]),
  };
});

// ---------- SQL sample queries with derived results ----------
export const sqlQueries = [
  { name: 'Total Sales', sql: `SELECT SUM(Amount) AS TotalSales\nFROM Sales\nWHERE OrderDate BETWEEN '2021-01-01' AND '2025-12-31';`, columns: ['TotalSales'], rows: [[totalSales]] },
  { name: 'Monthly Sales', sql: `SELECT MONTH(OrderDate) AS Month,\n       SUM(Amount) AS MonthlySales\nFROM Sales\nWHERE YEAR(OrderDate) = 2025\nGROUP BY MONTH(OrderDate)\nORDER BY Month;`, columns: ['Month', 'MonthlySales'], rows: lastYearMonthly.map((v, i) => [i + 1, v]).filter(r => r[1] > 0) },
  { name: 'Top Products', sql: `SELECT TOP 5 P.ProductName,\n       SUM(O.Quantity) AS UnitsSold,\n       SUM(O.Amount) AS Revenue\nFROM Orders O\nJOIN Products P ON O.ProductID = P.ProductID\nGROUP BY P.ProductName\nORDER BY Revenue DESC;`, columns: ['ProductName', 'UnitsSold', 'Revenue'], rows: topProducts.slice(0, 5).map(p => [p.name, p.units, p.sales]) },
  { name: 'Top Customers', sql: `SELECT TOP 5 C.CustomerName,\n       COUNT(O.OrderID) AS Orders,\n       SUM(O.Amount) AS TotalSpent\nFROM Orders O\nJOIN Customers C ON O.CustomerID = C.CustomerID\nGROUP BY C.CustomerName\nORDER BY TotalSpent DESC;`, columns: ['CustomerName', 'Orders', 'TotalSpent'], rows: topCustomers.slice(0, 5).map(c => [c.name, c.orders, c.spent]) },
  { name: 'Region Wise Sales', sql: `SELECT R.RegionName,\n       SUM(S.Amount) AS Sales\nFROM Sales S\nJOIN Regions R ON S.RegionID = R.RegionID\nGROUP BY R.RegionName\nORDER BY Sales DESC;`, columns: ['RegionName', 'Sales'], rows: [...salesByRegion].sort((a, b) => b.sales - a.sales).map(r => [r.region, r.sales]) },
  { name: 'Profit Analysis', sql: `SELECT P.Category,\n       SUM(O.Amount - O.Cost) AS Profit\nFROM Orders O\nJOIN Products P ON O.ProductID = P.ProductID\nGROUP BY P.Category\nORDER BY Profit DESC;`, columns: ['Category', 'Profit'], rows: [...revenueByCategory].sort((a, b) => b.profit - a.profit).map(c => [c.category, c.profit]) },
  { name: 'Revenue Comparison', sql: `SELECT YEAR(OrderDate) AS Year,\n       SUM(Amount) AS Revenue\nFROM Sales\nWHERE OrderDate >= '2021-01-01'\nGROUP BY YEAR(OrderDate)\nORDER BY Year;`, columns: ['Year', 'Revenue'], rows: YEARS.map(y => [y, revByYear(y)]) },
];

// ---------- Reports list ----------
export const reportsList = [
  { name: 'Sales Report', icon: 'ShoppingCart', desc: 'Comprehensive sales performance across periods', color: 'from-blue-500 to-blue-600' },
  { name: 'Customer Report', icon: 'Users', desc: 'Customer acquisition, retention & lifetime value', color: 'from-emerald-500 to-emerald-600' },
  { name: 'Revenue Report', icon: 'IndianRupee', desc: 'Revenue streams, recognition & growth trends', color: 'from-violet-500 to-violet-600' },
  { name: 'Profit Report', icon: 'TrendingUp', desc: 'Margin analysis and profit distribution by category', color: 'from-amber-500 to-amber-600' },
  { name: 'Inventory Report', icon: 'Boxes', desc: 'Stock levels, turnover and reorder triggers', color: 'from-cyan-500 to-cyan-600' },
  { name: 'Performance Report', icon: 'Gauge', desc: 'Sales rep & regional performance scorecards', color: 'from-rose-500 to-rose-600' },
];

// ---------- Architecture ----------
export const architectureSteps = [
  { label: 'Excel Dataset', icon: 'FileSpreadsheet', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Microsoft SQL Server', icon: 'Database', color: 'from-blue-500 to-blue-600' },
  { label: 'SQL Queries', icon: 'Terminal', color: 'from-violet-500 to-violet-600' },
  { label: 'Power BI', icon: 'BarChart3', color: 'from-amber-500 to-amber-600' },
  { label: 'Dashboard', icon: 'LayoutDashboard', color: 'from-cyan-500 to-cyan-600' },
  { label: 'Business Insights', icon: 'Lightbulb', color: 'from-rose-500 to-rose-600' },
  { label: 'Decision Making', icon: 'Brain', color: 'from-teal-500 to-teal-600' },
];

// ---------- Notifications ----------
export const notifications = [
  { id: 1, title: 'New enterprise order received', desc: `${topCustomers[0].name} placed a new order.`, time: '2 min ago', type: 'success', icon: 'ShoppingCart' },
  { id: 2, title: 'Inventory alert: Low stock product', desc: 'A product has dropped below reorder level.', time: '18 min ago', type: 'warning', icon: 'AlertTriangle' },
  { id: 3, title: 'Monthly report ready', desc: 'Latest sales report is available for download.', time: '1 hour ago', type: 'info', icon: 'FileText' },
  { id: 4, title: 'Customer reorder placed', desc: 'A repeat customer placed a new order this quarter.', time: '3 hours ago', type: 'success', icon: 'RefreshCw' },
  { id: 5, title: 'Sales target achieved', desc: `${topReg.region} region crossed quarterly target.`, time: '5 hours ago', type: 'success', icon: 'Trophy' },
  { id: 6, title: 'Return rate update', desc: `Current return rate is ${returnRate}%.`, time: '1 day ago', type: 'warning', icon: 'RotateCcw' },
];

// ---------- Extra analytics page data (derived where possible) ----------
export const customerSegments = CUSTOMER_TYPES.map((seg, i) => {
  const segCust = customers.filter(c => c.type === seg);
  const segCustIds = new Set(segCust.map(c => c.id));
  const segOrders = orders.filter(o => segCustIds.has(o.customerId) && o.status !== 'Cancelled');
  return {
    segment: seg,
    customers: segCust.length,
    revenue: segOrders.reduce((s, o) => s + o.amount, 0),
    color: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][i],
  };
});

export const customerAcquisition = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const newCust = customers.filter(c => {
    const custOrders = orders.filter(o => o.customerId === c.id);
    return custOrders.some(o => o.year === 2025 && o.month === monthNum) &&
           !custOrders.some(o => o.year < 2025 || (o.year === 2025 && o.month < monthNum));
  }).length;
  return {
    month: m,
    new: newCust + intIn(20, 40),
    churned: intIn(4, 12),
    retained: Math.round(totalCustomers * (0.7 + i * 0.02)),
  };
});

export const customerRFM = CUSTOMER_TYPES.map((seg, i) => {
  const segCustIds = new Set(customers.filter(c => c.type === seg).map(c => c.id));
  const segOrders = orders.filter(o => segCustIds.has(o.customerId));
  const recency = Math.round(2025 - 2021 + (i * 12));
  return {
    segment: seg,
    count: customers.filter(c => c.type === seg).length,
    recency,
    frequency: Math.round(segOrders.length / Math.max(customers.filter(c => c.type === seg).length, 1) * 10),
    monetary: Math.round(segOrders.reduce((s, o) => s + o.amount, 0) / 1e7 * 10) / 10,
    color: ['from-emerald-400 to-emerald-600', 'from-blue-400 to-blue-600', 'from-amber-400 to-amber-600', 'from-rose-400 to-rose-600'][i],
  };
});

export const customerLoyalty = [
  { tier: 'Platinum', customers: Math.round(totalCustomers * 0.08), avgSpend: avgOrderValue * 20, retention: 96 },
  { tier: 'Gold', customers: Math.round(totalCustomers * 0.22), avgSpend: avgOrderValue * 10, retention: 88 },
  { tier: 'Silver', customers: Math.round(totalCustomers * 0.4), avgSpend: avgOrderValue * 5, retention: 74 },
  { tier: 'Bronze', customers: Math.round(totalCustomers * 0.3), avgSpend: avgOrderValue * 2, retention: 58 },
];

export const productPerformance = CATEGORIES.map((c, i) => {
  const catOrders = orders.filter(o => o.category === c);
  return {
    category: c,
    units: catOrders.reduce((s, o) => s + o.qty, 0),
    revenue: catOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
    margin: round2((catOrders.reduce((s, o) => s + o.profit, 0) / Math.max(catOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0), 1)) * 100),
    returns: round2((catOrders.filter(o => o.status === 'Returned').length / Math.max(catOrders.length, 1)) * 100),
  };
});

export const productVelocity = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const row: Record<string, number | string> = { month: m };
  CATEGORIES.forEach(c => {
    row[c] = orders.filter(o => o.category === c && o.month === monthNum).reduce((s, o) => s + o.qty, 0);
  });
  return row;
});

export const productMargins = topProducts.map(p => {
  const prod = products.find(x => x.name === p.name);
  const margin = prod ? round2(((prod.price - prod.cost) / prod.price) * 100) : 20;
  return { name: p.name, margin, revenue: p.sales, category: products.find(x => x.name === p.name)?.category ?? 'Electronics' };
});

export const inventoryTurnover = CATEGORIES.map((c, i) => {
  const catProds = products.filter(p => p.category === c);
  const sold = orders.filter(o => o.category === c).reduce((s, o) => s + o.qty, 0);
  const avgStock = catProds.reduce((s, p) => s + p.stock, 0) / Math.max(catProds.length, 1);
  return {
    category: c,
    turnover: round2(sold / Math.max(avgStock, 1)),
    daysOfStock: Math.round(365 / Math.max(sold / Math.max(avgStock, 1), 0.1)),
  };
});

export const regionalBreakdown = salesByRegion.map(r => ({
  ...r,
  profit: orders.filter(o => o.region === r.region).reduce((s, o) => s + o.profit, 0),
  reps: REPS.filter(rep => orders.find(o => o.salesRep === rep && o.region === r.region)).length,
}));

export const statePerformance = STATES.slice(0, 10).map(state => {
  const sOrders = orders.filter(o => o.state === state);
  return {
    state,
    region: regionOf(state),
    sales: sOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0),
    growth: round2(4 + (sOrders.length % 30) / 3),
    orders: sOrders.length,
    customers: new Set(sOrders.map(o => o.customerId)).size,
  };
}).sort((a, b) => b.sales - a.sales);

export const regionCategoryMatrix = REGIONS.map(r => {
  const row: Record<string, number | string> = { region: r };
  CATEGORIES.forEach(c => {
    row[c] = orders.filter(o => o.region === r && o.category === c).reduce((s, o) => s + o.qty, 0);
  });
  return row;
});

export const employeePerformance = REPS.map((name, i) => {
  const repOrders = orders.filter(o => o.salesRep === name);
  const sales = repOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
  const target = Math.round(sales / (0.85 + (i % 5) * 0.04));
  return {
    id: 'E' + String(201 + i), name, role: i < 4 ? 'Senior Sales Rep' : 'Sales Rep',
    region: repOrders[0]?.region ?? 'West', manager: 'Rohan Kapoor',
    sales, rating: round2(4 + (i % 5) * 0.12), joined: 2018 + (i % 5),
    target, achievement: round2((sales / target) * 100),
    deals: repOrders.length, conversion: round2(60 + (i % 8) * 2),
  };
});

export const employeeLeaderboard = [...employeePerformance]
  .sort((a, b) => b.sales - a.sales)
  .map((e, i) => ({ rank: i + 1, name: e.name, region: e.region, sales: e.sales, target: e.target, deals: e.deals, rating: e.rating }));

export const employeeTrend = MONTHS.map((m, i) => {
  const monthNum = i + 1;
  const row: Record<string, number | string> = { month: m };
  REPS.slice(0, 3).forEach(rep => {
    row[rep] = orders.filter(o => o.salesRep === rep && o.month === monthNum && o.status !== 'Cancelled')
      .reduce((s, o) => s + o.amount, 0);
  });
  return row;
});

export const forecastAccuracy = MONTHS.slice(0, 6).map((m, i) => {
  const actual = lastYearMonthly[i] || 0;
  return {
    month: m,
    predicted: Math.round(actual * (0.92 + (i % 4) * 0.02)),
    actual,
  };
}).filter(r => r.actual > 0);

export const forecastScenarios = [
  { scenario: 'Optimistic', q3: Math.round(revByYear(2025) * 0.35 / 1e7), q4: Math.round(revByYear(2025) * 0.4 / 1e7), color: '#10b981' },
  { scenario: 'Base', q3: Math.round(revByYear(2025) * 0.3 / 1e7), q4: Math.round(revByYear(2025) * 0.34 / 1e7), color: '#2563eb' },
  { scenario: 'Conservative', q3: Math.round(revByYear(2025) * 0.26 / 1e7), q4: Math.round(revByYear(2025) * 0.28 / 1e7), color: '#f59e0b' },
];

export const forecastDrivers = [
  { driver: 'Seasonal Demand', impact: 28, direction: 'up' },
  { driver: 'Festival Sales', impact: 22, direction: 'up' },
  { driver: 'New Product Launch', impact: 18, direction: 'up' },
  { driver: 'Market Expansion', impact: 14, direction: 'up' },
  { driver: 'Price Sensitivity', impact: -8, direction: 'down' },
  { driver: 'Competition', impact: -6, direction: 'down' },
];

export const aiRecommendations = [
  { title: `Increase ${topCat.category} inventory by 32%`, rationale: `${topCat.category} shows ${Math.round((topCat.profit / totalCatProfit) * 100)}% profit contribution with strong demand across regions.`, impact: 'High', confidence: 92, metric: `+₹${(topCat.profit * 0.1 / 1e7).toFixed(1)} Cr projected`, icon: 'TrendingUp', color: 'from-emerald-400 to-emerald-600' },
  { title: `Target ${topReg.region} India expansion`, rationale: `${topReg.region} region growing at ${topReg.growth}% — above national average. ${topReg.customers} active customers.`, impact: 'High', confidence: 88, metric: `+₹${(topReg.sales * 0.15 / 1e7).toFixed(1)} Cr addressable`, icon: 'Rocket', color: 'from-blue-400 to-blue-600' },
  { title: 'Re-engage At-Risk customers', rationale: `${Math.round(totalCustomers * 0.16)} customers flagged as At-Risk by RFM. Win-back campaign could recover significant revenue.`, impact: 'Medium', confidence: 84, metric: `₹${(totalRevenue * 0.04 / 1e7).toFixed(1)} Cr recoverable`, icon: 'Users', color: 'from-violet-400 to-violet-600' },
  { title: `Review ${lowMarginCat.category} pricing`, rationale: `${lowMarginCat.category} has the lowest profit contribution. Reallocate shelf space to higher-margin categories.`, impact: 'Medium', confidence: 79, metric: `+${round2(profitMargin * 0.1)}% blended margin`, icon: 'AlertTriangle', color: 'from-amber-400 to-amber-600' },
  { title: 'Optimize pricing for Electronics', rationale: `Electronics drives high revenue. Price elasticity model suggests 4% increase would lift revenue with minimal volume impact.`, impact: 'High', confidence: 86, metric: `+₹${(revenueByCategory[0].revenue * 0.04 / 1e7).toFixed(1)} Cr revenue`, icon: 'DollarSign', color: 'from-teal-400 to-teal-600' },
  { title: 'Launch Q4 loyalty program', rationale: 'Platinum tier shows 96% retention with 4.2x LTV. Extend to Gold tier to lift retention from 88% to 92%.', impact: 'Medium', confidence: 81, metric: `+₹${(totalRevenue * 0.02 / 1e7).toFixed(1)} Cr LTV`, icon: 'Award', color: 'from-rose-400 to-rose-600' },
];

// ---------- KPI cards (derived) ----------
function sparkline(seed: number) {
  const r = mulberry32(seed);
  return Array.from({ length: 12 }, (_, i) => Math.round(20 + i * 2 + r() * 12));
}

export const KPIS = [
  { key: 'sales', label: 'Total Sales', value: totalSales, growth: round2(yoyGrowth), icon: 'ShoppingCart', color: 'from-blue-500 to-blue-600', sparkline: sparkline(101) },
  { key: 'revenue', label: 'Total Revenue', value: totalRevenue, growth: round2(yoyGrowth * 0.9), icon: 'IndianRupee', color: 'from-emerald-500 to-emerald-600', sparkline: sparkline(202) },
  { key: 'profit', label: 'Net Profit', value: totalProfit, growth: round2(yoyGrowth * 1.2), icon: 'TrendingUp', color: 'from-violet-500 to-violet-600', sparkline: sparkline(303) },
  { key: 'orders', label: 'Total Orders', value: totalOrders, growth: 9.6, icon: 'Package', color: 'from-amber-500 to-amber-600', sparkline: sparkline(404) },
  { key: 'customers', label: 'Total Customers', value: totalCustomers, growth: 12.3, icon: 'Users', color: 'from-cyan-500 to-cyan-600', sparkline: sparkline(505) },
  { key: 'conversion', label: 'Conversion Rate', value: conversionRate, growth: 3.2, icon: 'Target', color: 'from-rose-500 to-rose-600', sparkline: sparkline(606), suffix: '%' },
  { key: 'aov', label: 'Avg Order Value', value: avgOrderValue, growth: 6.8, icon: 'ShoppingBag', color: 'from-fuchsia-500 to-fuchsia-600', sparkline: sparkline(707) },
  { key: 'margin', label: 'Profit Margin', value: profitMargin, growth: 4.1, icon: 'Percent', color: 'from-teal-500 to-teal-600', sparkline: sparkline(808), suffix: '%' },
  { key: 'returns', label: 'Return Rate', value: returnRate, growth: -0.8, icon: 'RotateCcw', color: 'from-orange-500 to-orange-600', sparkline: sparkline(909), suffix: '%' },
  { key: 'csat', label: 'Customer Satisfaction', value: customerSatisfaction, growth: 2.4, icon: 'Smile', color: 'from-pink-500 to-pink-600', sparkline: sparkline(110), suffix: '/5' },
  { key: 'activeProducts', label: 'Active Products', value: activeProducts, growth: 5.2, icon: 'Boxes', color: 'from-indigo-500 to-indigo-600', sparkline: sparkline(121) },
];

// ---------- Formatters ----------
export const INR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const INR_CR = (n: number) => {
  if (Math.abs(n) >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (Math.abs(n) >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
  return INR(n);
};

// ---------- Re-exports for backwards compatibility ----------
export {
  STATES, CITIES, CITY_STATE, REGIONS, regionOf, CATEGORIES,
  PAYMENT_METHODS, CUSTOMER_TYPES, MONTHS, YEARS,
};
export const SALES_REPS = REPS;

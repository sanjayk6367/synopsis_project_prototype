// Pure constants for the Sales Analytics dataset (no imports — avoids circular deps)

export const STATES = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat',
  'Telangana', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Kerala',
  'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Odisha',
  'Chhattisgarh', 'Jharkhand',
];

export const CITIES = [
  'Mumbai', 'Pune', 'Nagpur', 'Bengaluru', 'Mysuru', 'Mangaluru',
  'Chennai', 'Coimbatore', 'Madurai', 'New Delhi',
  'Ahmedabad', 'Surat', 'Vadodara', 'Hyderabad', 'Warangal',
  'Kolkata', 'Howrah', 'Lucknow', 'Kanpur', 'Noida',
  'Jaipur', 'Jodhpur', 'Kochi', 'Thiruvananthapuram', 'Kozhikode',
  'Chandigarh', 'Amritsar', 'Gurugram', 'Faridabad', 'Bhopal',
  'Indore', 'Patna', 'Gaya', 'Bhubaneswar', 'Cuttack',
  'Raipur', 'Ranchi',
];

// city -> state mapping (keeps generated records realistic)
export const CITY_STATE: Record<string, string> = {
  Mumbai: 'Maharashtra', Pune: 'Maharashtra', Nagpur: 'Maharashtra',
  Bengaluru: 'Karnataka', Mysuru: 'Karnataka', Mangaluru: 'Karnataka',
  Chennai: 'Tamil Nadu', Coimbatore: 'Tamil Nadu', Madurai: 'Tamil Nadu',
  'New Delhi': 'Delhi',
  Ahmedabad: 'Gujarat', Surat: 'Gujarat', Vadodara: 'Gujarat',
  Hyderabad: 'Telangana', Warangal: 'Telangana',
  Kolkata: 'West Bengal', Howrah: 'West Bengal',
  Lucknow: 'Uttar Pradesh', Kanpur: 'Uttar Pradesh', Noida: 'Uttar Pradesh',
  Jaipur: 'Rajasthan', Jodhpur: 'Rajasthan',
  Kochi: 'Kerala', Thiruvananthapuram: 'Kerala', Kozhikode: 'Kerala',
  Chandigarh: 'Punjab', Amritsar: 'Punjab',
  Gurugram: 'Haryana', Faridabad: 'Haryana',
  Bhopal: 'Madhya Pradesh', Indore: 'Madhya Pradesh',
  Patna: 'Bihar', Gaya: 'Bihar',
  Bhubaneswar: 'Odisha', Cuttack: 'Odisha',
  Raipur: 'Chhattisgarh', Ranchi: 'Jharkhand',
};

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'] as const;

const STATE_REGION: Record<string, typeof REGIONS[number]> = {
  Maharashtra: 'West', Gujarat: 'West', Rajasthan: 'West', Goa: 'West',
  'Tamil Nadu': 'South', Karnataka: 'South', Kerala: 'South', Telangana: 'South',
  'West Bengal': 'East', Odisha: 'East', Bihar: 'East', Jharkhand: 'East',
  Delhi: 'North', 'Uttar Pradesh': 'North', Punjab: 'North', Haryana: 'North',
  'Madhya Pradesh': 'Central', Chhattisgarh: 'Central',
};
export const regionOf = (state: string) => STATE_REGION[state] ?? 'Central';

export const CATEGORIES = ['Electronics', 'Furniture', 'Grocery', 'Clothing', 'Sports'] as const;

export const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery', 'Wallet'];

export const CUSTOMER_TYPES = ['Retail', 'Wholesale', 'Corporate', 'Enterprise'];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const YEARS = [2021, 2022, 2023, 2024, 2025];

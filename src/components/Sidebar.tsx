import { NavLink } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { to: '/app/sales', label: 'Sales Analytics', icon: 'BarChart3' },
  { to: '/app/customer-analytics', label: 'Customer Analytics', icon: 'UserCircle' },
  { to: '/app/product-analytics', label: 'Product Analytics', icon: 'PackageSearch' },
  { to: '/app/regional-analytics', label: 'Regional Analytics', icon: 'Map' },
  { to: '/app/employees', label: 'Employee Performance', icon: 'UserCog' },
  { to: '/app/forecast', label: 'Sales Forecast', icon: 'LineChart' },
  { to: '/app/customers', label: 'Customers', icon: 'Users' },
  { to: '/app/products', label: 'Products', icon: 'Package' },
  { to: '/app/orders', label: 'Orders', icon: 'ShoppingCart' },
  { to: '/app/inventory', label: 'Inventory', icon: 'Boxes' },
  { to: '/app/reports', label: 'Reports', icon: 'FileText' },
  { to: '/app/insights', label: 'Business Insights', icon: 'Lightbulb' },
  { to: '/app/database', label: 'SQL Database', icon: 'Database' },
  { to: '/app/query', label: 'SQL Query', icon: 'Terminal' },
  { to: '/app/about', label: 'About Project', icon: 'Info' },
  { to: '/app/settings', label: 'Settings', icon: 'Settings' },
];

interface SidebarProps { open: boolean; setOpen: (v: boolean) => void; }

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: open ? 264 : 80 }}
        className="fixed lg:sticky top-0 z-40 h-screen glass-strong border-r border-navy-100 dark:border-navy-700/50 flex flex-col"
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-100 dark:border-navy-700/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-glow shrink-0">
            <BarChart3 size={20} />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold leading-tight text-navy-900 dark:text-white">Sales Analytics</p>
                <p className="text-[10px] text-navy-500 dark:text-navy-400">Power BI Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''} ${!open ? 'justify-center' : ''}`}
              title={item.label}
            >
              <Icon name={item.icon} size={18} className="shrink-0" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-navy-100 dark:border-navy-700/50 space-y-0.5">
          <button onClick={() => navigate('/')} className={`nav-link w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 ${!open ? 'justify-center' : ''}`}>
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
          <button onClick={() => setOpen(!open)} className={`nav-link w-full ${!open ? 'justify-center' : ''}`}>
            <ChevronLeft size={18} className={`transition-transform ${!open ? 'rotate-180' : ''}`} />
            {open && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Currency, Bell, Database, Shield, User, HardDriveDownload, Check } from 'lucide-react';

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? 'bg-primary-600' : 'bg-navy-200 dark:bg-navy-700'}`}>
    <motion.span layout className={`block w-5 h-5 rounded-full bg-white shadow ${on ? 'ml-5' : 'ml-0'}`} />
  </button>
);

const Row = ({ icon: IconCmp, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-navy-100 dark:border-navy-700/50 last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-700/60 flex items-center justify-center text-navy-600 dark:text-navy-300 shrink-0">
        <IconCmp size={18} />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{title}</p>
        <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export const Settings = () => {
  const { theme, toggle } = useTheme();
  const [notif, setNotif] = useState(true);
  const [backup, setBackup] = useState(false);
  const [twoFa, setTwoFa] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('English');

  return (
    <AppLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card delay={0} className="p-5">
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-2">Appearance &amp; Localization</h3>
          <Row icon={theme === 'dark' ? Moon : Sun} title="Dark Mode" desc="Toggle between light and dark themes">
            <Toggle on={theme === 'dark'} onClick={toggle} />
          </Row>
          <Row icon={Globe} title="Language" desc="Interface display language">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input h-9 w-36 text-sm">
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'].map(l => <option key={l}>{l}</option>)}
            </select>
          </Row>
          <Row icon={Currency} title="Currency" desc="Display currency format">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input h-9 w-36 text-sm">
              {['INR', 'USD', 'EUR', 'GBP', 'AED'].map(c => <option key={c}>{c}</option>)}
            </select>
          </Row>
        </Card>

        <Card delay={0.05} className="p-5">
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-2">Notifications &amp; Security</h3>
          <Row icon={Bell} title="Push Notifications" desc="Receive alerts for orders &amp; inventory">
            <Toggle on={notif} onClick={() => setNotif(n => !n)} />
          </Row>
          <Row icon={Shield} title="Two-Factor Authentication" desc="Extra layer of account security">
            <Toggle on={twoFa} onClick={() => setTwoFa(t => !t)} />
          </Row>
          <Row icon={User} title="Profile" desc="Manage your account information">
            <button className="btn-ghost text-sm border border-navy-200 dark:border-navy-700">Edit</button>
          </Row>
        </Card>

        <Card delay={0.1} className="p-5">
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-2">Database Connection</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-navy-500 dark:text-navy-400">Server</label>
              <input className="input mt-1 font-mono text-sm" defaultValue="localhost\\SQLEXPRESS" />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-500 dark:text-navy-400">Database</label>
              <input className="input mt-1 font-mono text-sm" defaultValue="SalesAnalyticsDB" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-navy-500 dark:text-navy-400">Username</label>
                <input className="input mt-1 font-mono text-sm" defaultValue="sa" />
              </div>
              <div>
                <label className="text-xs font-medium text-navy-500 dark:text-navy-400">Port</label>
                <input className="input mt-1 font-mono text-sm" defaultValue="1433" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button className="btn-primary text-sm"><Database size={14} /> Test Connection</button>
              <span className="chip bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"><Check size={12} /> Connected</span>
            </div>
          </div>
        </Card>

        <Card delay={0.15} className="p-5">
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-2">Backup &amp; Data</h3>
          <Row icon={HardDriveDownload} title="Auto Backup" desc="Daily database backup to cloud">
            <Toggle on={backup} onClick={() => setBackup(b => !b)} />
          </Row>
          <div className="mt-4 p-4 rounded-xl bg-navy-50 dark:bg-navy-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-navy-800 dark:text-navy-100">Storage Usage</p>
              <span className="text-xs text-navy-500">4.2 GB / 10 GB</span>
            </div>
            <div className="h-2 rounded-full bg-navy-200 dark:bg-navy-600 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            </div>
            <p className="text-xs text-navy-500 mt-2">Last backup: 19 Jul 2025, 03:00 AM</p>
          </div>
          <button className="btn-primary text-sm w-full mt-4"><HardDriveDownload size={14} /> Backup Now</button>
        </Card>
      </div>
    </AppLayout>
  );
};

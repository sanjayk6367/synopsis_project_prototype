import { useEffect, useState } from 'react';
import { Icon } from './ui/Icon';
import { useTheme, ThemeName } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, KeyRound, LogOut, Settings, Palette, Check, X } from 'lucide-react';
import { notifications as notifData } from '../data/mockData';

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const themes: { id: ThemeName; label: string; icon: any }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'corporate', label: 'Corporate', icon: Palette },
];

const notifColor: Record<string, string> = {
  success: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  warning: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300',
  info: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
};

interface TopbarProps { onMenu: () => void; }

export const Topbar = ({ onMenu }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  const now = useClock();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const closeAll = () => { setProfileOpen(false); setNotifOpen(false); setThemeOpen(false); };

  return (
    <header className="sticky top-0 z-20 glass-strong border-b border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40">
      <div className="flex items-center gap-3 px-4 h-16">
        <button onClick={onMenu} className="btn-ghost lg:hidden"><Menu size={20} /></button>

        <div className="hidden md:flex items-center gap-2 text-sm text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">
          <Icon name="Calendar" size={16} />
          <span>{dateStr}</span>
          <span className="text-navy-300 dark:text-navy-600 theme-corporate:text-blue-700">|</span>
          <span className="font-mono font-medium text-navy-700 dark:text-navy-200 theme-corporate:text-blue-100">{timeStr}</span>
        </div>

        <div className="flex-1 max-w-md mx-auto md:mx-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input placeholder="Search orders, customers, products..." className="input pl-9 h-10 text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme switcher */}
          <div className="relative">
            <button onClick={() => { closeAll(); setThemeOpen(o => !o); }} className="btn-ghost" title="Theme">
              <Palette size={18} />
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-44 card p-1.5 z-30">
                  <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-navy-400 font-semibold">Dashboard Theme</p>
                  {themes.map(t => (
                    <button key={t.id} onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm hover:bg-navy-100 dark:hover:bg-navy-700/60 theme-corporate:hover:bg-blue-800/60">
                      <span className="flex items-center gap-2"><t.icon size={14} /> {t.label}</span>
                      {theme === t.id && <Check size={14} className="text-primary-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { closeAll(); setNotifOpen(o => !o); }} className="btn-ghost relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-navy-800 theme-corporate:ring-blue-900" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-80 card p-0 z-30 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40">
                    <div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Notifications</p>
                      <p className="text-[10px] text-navy-500">{notifData.length} unread</p>
                    </div>
                    <button onClick={() => setNotifOpen(false)} className="btn-ghost h-7 w-7 p-0"><X size={14} /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifData.map(n => (
                      <div key={n.id} className="flex gap-3 px-4 py-3 border-b border-navy-50 dark:border-navy-700/30 theme-corporate:border-blue-800/30 hover:bg-navy-50 dark:hover:bg-navy-700/40 theme-corporate:hover:bg-blue-800/40">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notifColor[n.type]}`}>
                          <Icon name={n.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100 truncate">{n.title}</p>
                          <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300 mt-0.5 line-clamp-2">{n.desc}</p>
                          <p className="text-[10px] text-navy-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full px-4 py-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-600/10 theme-corporate:hover:bg-blue-800/40">
                    View all notifications
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { closeAll(); setProfileOpen(o => !o); }} className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700/60 theme-corporate:hover:bg-blue-800/60">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 text-white flex items-center justify-center text-sm font-semibold">AS</div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-navy-800 dark:text-navy-100 theme-corporate:text-blue-100">Admin User</p>
                <p className="text-[10px] text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-navy-400" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-56 card p-1.5 z-30">
                  <div className="px-3 py-2.5 border-b border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40 mb-1">
                    <p className="text-sm font-semibold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Admin User</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 theme-corporate:text-blue-300">admin@salesanalytics.in</p>
                  </div>
                  {[
                    { label: 'My Profile', icon: User },
                    { label: 'Change Password', icon: KeyRound, action: () => { setPwdOpen(true); setProfileOpen(false); } },
                    { label: 'Settings', icon: Settings, action: () => navigate('/app/settings') },
                  ].map(item => (
                    <button key={item.label} onClick={() => { item.action?.(); if (!item.action) setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-navy-100 dark:hover:bg-navy-700/60 theme-corporate:hover:bg-blue-800/60 text-navy-700 dark:text-navy-200 theme-corporate:text-blue-200">
                      <item.icon size={15} /> {item.label}
                    </button>
                  ))}
                  <div className="border-t border-navy-100 dark:border-navy-700/50 theme-corporate:border-blue-700/40 mt-1 pt-1">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 theme-corporate:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Change Password modal */}
      <AnimatePresence>
        {pwdOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPwdOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()} className="card p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy-900 dark:text-navy-100 theme-corporate:text-blue-100">Change Password</h3>
                <button onClick={() => setPwdOpen(false)} className="btn-ghost"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-navy-500">Current Password</label><input type="password" className="input mt-1" /></div>
                <div><label className="text-xs font-medium text-navy-500">New Password</label><input type="password" className="input mt-1" /></div>
                <div><label className="text-xs font-medium text-navy-500">Confirm Password</label><input type="password" className="input mt-1" /></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setPwdOpen(false)} className="btn-primary flex-1">Update Password</button>
                <button onClick={() => setPwdOpen(false)} className="btn-ghost border border-navy-200 dark:border-navy-700 theme-corporate:border-blue-700/50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

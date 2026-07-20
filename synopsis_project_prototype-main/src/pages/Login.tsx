import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';

const sparkData = Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 2) * 12 + i * 2 }));
const barData = Array.from({ length: 8 }, (_, i) => ({ v: 30 + Math.cos(i / 1.5) * 18 + i * 3 }));

export const Login = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/app/dashboard'), 900);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900" />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.35) 0%, transparent 40%)',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Floating chart decorations */}
      <motion.div className="absolute top-20 left-12 w-56 h-32 opacity-20 hidden md:block" animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity }}>
        <ResponsiveContainer><AreaChart data={sparkData}><Area dataKey="v" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} /></AreaChart></ResponsiveContainer>
      </motion.div>
      <motion.div className="absolute bottom-24 right-16 w-48 h-32 opacity-20 hidden md:block" animate={{ y: [0, 18, 0] }} transition={{ duration: 7, repeat: Infinity }}>
        <ResponsiveContainer><BarChart data={barData}><Bar dataKey="v" fill="#a78bfa" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
      </motion.div>
      <motion.div className="absolute top-1/3 right-24 w-44 h-24 opacity-20 hidden lg:block" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }}>
        <ResponsiveContainer><LineChart data={sparkData}><Line dataKey="v" stroke="#34d399" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
      </motion.div>

      {/* Floating stats */}
      <motion.div className="absolute top-32 right-12 glass-strong rounded-2xl px-4 py-3 text-white hidden lg:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity }}>
        <p className="text-xs text-white/70">Total Revenue</p>
        <p className="text-lg font-bold">₹39.51 Cr</p>
        <p className="text-xs text-emerald-300">+14.2% YoY</p>
      </motion.div>
      <motion.div className="absolute bottom-32 left-16 glass-strong rounded-2xl px-4 py-3 text-white hidden lg:block" animate={{ y: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity }}>
        <p className="text-xs text-white/70">Active Customers</p>
        <p className="text-lg font-bold">1,048</p>
        <p className="text-xs text-emerald-300">+12.3% growth</p>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center text-center mb-7">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-glow mb-4"
            >
              <BarChart3 size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sales Analytics Dashboard</h1>
            <p className="text-sm text-white/70 mt-1">Powered by Microsoft SQL Server &amp; Power BI</p>
            <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Enterprise BI Platform
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  defaultValue="admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 outline-none text-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  defaultValue="admin123"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 outline-none text-sm"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setRemember(r => !r)} className="flex items-center gap-2 text-white/80">
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${remember ? 'bg-primary-500 border-primary-500' : 'border-white/30'}`}>
                  {remember && <CheckCircle2 size={12} className="text-white" />}
                </span>
                Remember me
              </button>
              <button type="button" className="text-primary-300 hover:text-primary-200 text-xs">Forgot password?</button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-white/50 mt-6">
            B.Tech AI &amp; DS · Final Year Project · v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

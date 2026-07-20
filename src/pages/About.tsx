import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { architectureSteps } from '../data/mockData';
import { motion } from 'framer-motion';
import { ArrowDown, GraduationCap, Target, Layers, Code2, User, BookOpen, Building2, Network } from 'lucide-react';

const techStack = [
  { name: 'React.js', icon: 'Atom' },
  { name: 'TypeScript', icon: 'Code2' },
  { name: 'Tailwind CSS', icon: 'Palette' },
  { name: 'React Router', icon: 'Route' },
  { name: 'Framer Motion', icon: 'Sparkles' },
  { name: 'Recharts', icon: 'BarChart3' },
  { name: 'Lucide Icons', icon: 'Icons' },
  { name: 'MS SQL Server', icon: 'Database' },
  { name: 'Power BI', icon: 'LineChart' },
];

const objectives = [
  'Analyze large-scale sales data to extract actionable business insights',
  'Visualize KPIs and trends using interactive Power BI-style dashboards',
  'Enable data-driven decision-making for sales and marketing teams',
  'Demonstrate end-to-end data pipeline: Excel → SQL Server → Power BI → Dashboard',
  'Apply SQL querying for aggregation, filtering and reporting on sales data',
];

export const About = () => (
  <AppLayout title="About Project">
    <Card delay={0} className="p-6 mb-5 bg-gradient-to-br from-navy-900 to-primary-900 text-white border-0">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur shrink-0">
          <GraduationCap size={28} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">Final Year B.Tech Project</p>
          <h2 className="text-2xl font-bold mt-1">Data Analytics on Sales Data Using Power BI and MS SQL Server</h2>
          <p className="text-white/80 text-sm mt-2 max-w-3xl">
            A comprehensive business intelligence platform that ingests raw sales data, transforms it through Microsoft SQL Server, and presents interactive visual analytics inspired by Microsoft Power BI.
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card delay={0.05} className="p-5 lg:col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-primary-600" />
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">Project Objectives</h3>
        </div>
        <ul className="space-y-2.5">
          {objectives.map((o, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-600/20 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-navy-700 dark:text-navy-200">{o}</p>
            </motion.li>
          ))}
        </ul>
      </Card>

      <Card delay={0.1} className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-primary-600" />
          <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">Project Details</h3>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Developer', value: 'B.Tech AI & DS Student', icon: User },
            { label: 'Guide', value: 'Prof. (Guide Name)', icon: BookOpen },
            { label: 'Department', value: 'AI & Data Science', icon: Layers },
            { label: 'College', value: 'Your College Name', icon: Building2 },
            { label: 'Academic Year', value: '2025 - 2026', icon: GraduationCap },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-50 dark:bg-navy-700/30">
              <d.icon size={16} className="text-primary-600 shrink-0" />
              <div>
                <p className="text-xs text-navy-500 dark:text-navy-400">{d.label}</p>
                <p className="font-medium text-navy-800 dark:text-navy-100">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Architecture Diagram */}
    <Card delay={0.15} className="p-5 mt-5">
      <div className="flex items-center gap-2 mb-5">
        <Network size={18} className="text-primary-600" />
        <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">System Architecture</h3>
      </div>
      <div className="flex flex-col items-center gap-1">
        {architectureSteps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}
              className={`px-6 py-3.5 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-soft flex items-center gap-3 min-w-[220px]`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <Icon name={step.icon} size={18} />
              </div>
              <span className="font-semibold">{step.label}</span>
            </motion.div>
            {i < architectureSteps.length - 1 && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 + 0.08 }}>
                <ArrowDown size={18} className="text-navy-400 dark:text-navy-500 my-0.5" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </Card>

    {/* Tech Stack */}
    <Card delay={0.2} className="p-5 mt-5">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={18} className="text-primary-600" />
        <h3 className="text-base font-semibold text-navy-900 dark:text-navy-100">Technology Stack</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {techStack.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} className="p-3 rounded-xl bg-navy-50 dark:bg-navy-700/30 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
              <Icon name={t.icon} size={18} />
            </div>
            <p className="text-xs font-medium text-navy-800 dark:text-navy-100">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  </AppLayout>
);

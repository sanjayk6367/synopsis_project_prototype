import { ReactNode, useRef, useState, useCallback } from 'react';
import { Card, SectionTitle } from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, Minimize2, Image, FileSpreadsheet, ZoomIn, ZoomOut, X } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
  csvData?: Record<string, any>[];
  chartRef?: React.RefObject<any>;
}

export const ChartCard = ({ title, subtitle, action, children, className = '', delay = 0, csvData, chartRef }: ChartCardProps) => {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const exportPNG = useCallback(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new (Image as any)();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }, [title]);

  const exportCSV = useCallback(() => {
    if (!csvData || csvData.length === 0) return;
    const keys = Object.keys(csvData[0]);
    const rows = [keys.join(','), ...csvData.map(r => keys.map(k => r[k]).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }, [title, csvData]);

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.1 }}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );

  const toolbar = (
    <div className="flex items-center gap-0.5">
      <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="btn-ghost h-7 w-7 p-0" title="Zoom out"><ZoomOut size={14} /></button>
      <button onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} className="btn-ghost h-7 w-7 p-0" title="Zoom in"><ZoomIn size={14} /></button>
      <div className="relative">
        <button onClick={() => setMenuOpen(o => !o)} className="btn-ghost h-7 w-7 p-0" title="Export"><Download size={14} /></button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 mt-1 z-30 w-36 card p-1"
            >
              <button onClick={() => { exportPNG(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-navy-100 dark:hover:bg-navy-700/60">
                <Image size={13} /> Export PNG
              </button>
              <button onClick={() => { exportCSV(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-navy-100 dark:hover:bg-navy-700/60">
                <FileSpreadsheet size={13} /> Download CSV
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button onClick={() => setFullscreen(f => !f)} className="btn-ghost h-7 w-7 p-0" title="Fullscreen">
        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  );

  if (fullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setFullscreen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="card p-6 max-w-6xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900 dark:text-navy-100">{title}</h3>
                {subtitle && <p className="text-sm text-navy-500 dark:text-navy-400">{subtitle}</p>}
              </div>
              <button onClick={() => setFullscreen(false)} className="btn-ghost"><X size={18} /></button>
            </div>
            <div style={{ height: 480 }}>{children}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Card delay={delay} className={`p-4 ${className}`}>
      <SectionTitle title={title} subtitle={subtitle} action={<div className="flex items-center gap-2">{action}{toolbar}</div>} />
      {content}
    </Card>
  );
};

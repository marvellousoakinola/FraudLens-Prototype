import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  PieChart as PieChartIcon,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  MoreVertical,
  Layers,
  Search
} from 'lucide-react';
import { Card, Badge, Button, cn, Skeleton } from '../../components/ui';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { statsService } from '../../services/statsService';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [heroStats, setHeroStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await statsService.getAnalyticsStats();
        setData(res.data);
        setDistributionData(res.distribution);
        setHeroStats(res.hero);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Security Analytics</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Heuristic-based event correlation and deep-packet data mining.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 px-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl flex items-center gap-4">
             <Calendar className="w-4 h-4 text-[var(--foreground-muted)]" />
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">
                   {new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--foreground-muted)]" />
             </div>
          </div>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>
            Export Dataset
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {heroStats.map((stat, i) => {
           const IconComp = i === 0 ? TrendingUp : i === 1 ? Target : i === 2 ? Zap : Activity;
           return (
             <Card key={i} className="p-5 md:p-8 border-none bg-[var(--background-secondary)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <IconComp className="w-16 h-16 text-[var(--foreground)]" />
                </div>
                <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-[var(--foreground)] leading-none">{stat.value}</h3>
                  {stat.up !== null && (
                    <div className={cn(
                      "flex items-center gap-0.5 text-[10px] font-bold mb-1",
                      stat.up ? "text-emerald-500" : "text-rose-500"
                    )}>
                       {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                       {stat.trend}
                    </div>
                  )}
                </div>
             </Card>
           );
         })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        <div className="lg:col-span-2">
           <Card className="p-6 md:p-10 border-none bg-[var(--background-secondary)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                 <div>
                   <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest mb-1">Packet vs Threats Load</h3>
                   <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">24-Hour Cycle Intelligence</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <span className="text-[9px] font-black text-[var(--foreground-secondary)] uppercase tracking-widest">Base Load</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[9px] font-black text-[var(--foreground-secondary)] uppercase tracking-widest">Ingress Threats</span>
                   </div>
                 </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3ced" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#7c3ced" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px' }}
                       itemStyle={{ color: 'var(--foreground)', fontSize: '11px', fontWeight: 'bold' }}
                       labelStyle={{ color: 'var(--primary)', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}
                    />
                    <Area type="monotone" dataKey="load" stroke="#7c3ced" strokeWidth={3} fill="url(#loadGradient)" dot={{ r: 0 }} activeDot={{ r: 6, fill: '#7c3ced', stroke: '#fff', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={3} fill="url(#threatGradient)" dot={{ r: 0 }} activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)] flex flex-col min-h-[520px]">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Vector Distribution</h3>
                 </div>
                 <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
              </div>

              <div className="flex-grow space-y-8">
                {distributionData.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-xs font-bold text-[var(--foreground)] tracking-wide">{item.category}</span>
                      </div>
                      <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.value}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                         style={{ backgroundColor: item.color }}
                       />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-[var(--border-color)] mt-auto">
                 <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-all">
                    <div className="flex items-center gap-3">
                       <Layers className="w-5 h-5 text-primary" />
                       <p className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.2em]">Deep Detonation Log</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Bug,
  Video,
  Image as ImageIcon,
  Folder,
  UploadCloud,
  ChevronDown,
  MoreVertical,
  Monitor
} from 'lucide-react';
import { Card, Badge, Button, cn, Skeleton } from '../../components/ui';
import { motion } from 'motion/react';
import { historyService, scanService } from '../../services/scanService';
import { statsService, DashboardStats } from '../../services/statsService';
import { ScanResult } from '../../types';

export const DashboardPage: React.FC = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Period States
  const [currentRiskPeriod, setCurrentRiskPeriod] = useState('Daily');
  const [threatSummaryPeriod, setThreatSummaryPeriod] = useState('Yearly');
  const [threatDetailsPeriod, setThreatDetailsPeriod] = useState('Daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          historyService.getHistory().catch(() => []),
          statsService.getDashboardStats().catch(() => ({ 
            activeStreams: 0, 
            nodesOperational: 0, 
            riskScore: 0, 
            status: 'STABLE',
            summaryData: [],
            virusData: []
          }))
        ]);
        setHistory(historyRes);
        setStats(statsRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryData = stats?.summaryData || [];
  const virusData = stats?.virusData || [];
  
  const deviceData = [
    { id: 'DESKTOP-512', status: 12 },
    { id: 'MOBILE-X9', status: 64 },
    { id: 'SERVER-01', status: 5 },
    { id: 'WORKSTATION-2', status: 28 },
  ];

  const currentRiskStats = [
    { label: 'Total Threats', value: '0', icon: Bug, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Video File Risk', value: '0%', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Image File Risk', value: '0%', icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Docs File Risk', value: '0%', icon: UploadCloud, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Folder File Risk', value: '0%', icon: Folder, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Current Risk & Risk Score */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 p-5 md:p-8 border-none bg-[var(--background-secondary)]">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)] tracking-wide">Current Risk</h3>
             <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] text-xs h-8 gap-2" onClick={() => setCurrentRiskPeriod(prev => prev === 'Daily' ? 'Weekly' : prev === 'Weekly' ? 'Monthly' : 'Daily')}>
               {currentRiskPeriod} <ChevronDown className="w-3 h-3" />
             </Button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {currentRiskStats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-main)] group hover:border-primary/30 transition-all flex flex-col items-center text-center hover:translate-y-[-4px]"
                >
                   <div className={cn("p-3 rounded-xl mb-6 relative", stat.bg)}>
                     <stat.icon className={cn("w-5 h-5", stat.color)} />
                     <button className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => alert('Feature coming soon!')}>
                        <MoreVertical className="w-3 h-3 text-[var(--foreground-muted)]" />
                     </button>
                   </div>
                   <h4 className="text-2xl font-black text-[var(--foreground)] mb-2">{stat.value}</h4>
                   <p className="text-[10px] font-bold text-[var(--foreground-secondary)] uppercase tracking-widest leading-tight">{stat.label}</p>
                </motion.div>
              ))}
           </div>
        </Card>

        <Card className="lg:col-span-1 p-5 md:p-8 border-none bg-[var(--background-secondary)] flex flex-col items-center">
           <div className="w-full flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)]">Risk Score</h3>
             <MoreVertical className="w-4 h-4 text-[var(--foreground-secondary)]" />
           </div>
           
           <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(124,58,237,0.1)]" viewBox="0 0 200 200">
               <circle cx="100" cy="100" r="86" stroke="var(--background)" strokeWidth="10" fill="none" />
               <circle 
                 cx="100" 
                 cy="100" 
                 r="86" 
                 stroke="url(#riskDashGradient)" 
                 strokeWidth="12" 
                 fill="none" 
                 strokeDasharray="540" 
                 strokeDashoffset={540 - (540 * (stats?.riskScore || 0)) / 100} 
                 strokeLinecap="round" 
                 className="transition-all duration-1000 ease-in-out"
               />
               <defs>
                 <linearGradient id="riskDashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#f59e0b" />
                   <stop offset="50%" stopColor="#7c3ced" />
                   <stop offset="100%" stopColor="#ef4444" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
               <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1 tracking-widest">Risk Score</p>
               <h3 className="text-5xl font-black text-[var(--foreground)] leading-none">{(stats?.riskScore ?? 0).toString().padStart(2, '0')}</h3>
               <div className={cn(
                 "mt-4 px-4 py-1 rounded-full border",
                 stats?.status === 'SECURE' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
               )}>
                  <span className="text-[10px] font-black tracking-widest font-mono">{stats?.status || 'UNKNOWN'}</span>
               </div>
               <div className="absolute bottom-4 left-0 right-0 flex justify-between px-10 text-[9px] font-bold text-[var(--foreground-muted)] uppercase">
                 <span>0</span>
                 <span>100</span>
               </div>
             </div>
           </div>
        </Card>
      </div>

      {/* Middle Row: Threat Summary & Threats By Virus */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 p-5 md:p-8 border-none bg-[var(--background-secondary)]">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)] tracking-wide">Threat Summary</h3>
             <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] text-xs h-8 gap-2" onClick={() => setThreatSummaryPeriod(prev => prev === 'Yearly' ? 'Quarterly' : prev === 'Quarterly' ? 'Monthly' : 'Yearly')}>
               {threatSummaryPeriod} <ChevronDown className="w-3 h-3" />
             </Button>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={summaryData}>
                 <defs>
                   <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#7c3ced" stopOpacity={0.2} />
                     <stop offset="100%" stopColor="#7c3ced" stopOpacity={0} />
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
                    tickFormatter={(val) => `${val}%`}
                 />
                 <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px' }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeOpacity: 0.2 }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="value" 
                   stroke="#7c3ced" 
                   strokeWidth={3}
                   fill="url(#purpleGradient)"
                   dot={{ r: 0 }}
                   activeDot={{ r: 6, fill: '#7c3ced', stroke: '#fff', strokeWidth: 2 }}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="lg:col-span-1 p-5 md:p-8 border-none bg-[var(--background-secondary)] flex flex-col">
           <div className="w-full flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)]">Threats By Virus</h3>
             <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
           </div>

           <div className="flex-grow flex flex-col">
              <div className="h-[180px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={virusData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                     >
                       {virusData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">Total</p>
                    <h4 className="text-xl font-black text-[var(--foreground)]">
                      {virusData.reduce((acc, curr) => acc + curr.value, 0)}%
                    </h4>
                 </div>
              </div>

              <div className="mt-4 space-y-3">
                 {virusData.map((v, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                        <span className="text-[10px] font-bold text-[var(--foreground-secondary)]">{v.name}</span>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </Card>
      </div>

      {/* Bottom Row: Threat Details & Threat by device */}
      <div className="grid lg:grid-cols-4 gap-6 pb-4">
        <Card className="lg:col-span-3 p-5 md:p-8 border-none bg-[var(--background-secondary)]">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)] tracking-wide">Threat Details</h3>
             <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] text-xs h-8 gap-2" onClick={() => setThreatDetailsPeriod(prev => prev === 'Daily' ? 'Weekly' : prev === 'Weekly' ? 'Monthly' : 'Daily')}>
               {threatDetailsPeriod} <ChevronDown className="w-3 h-3" />
             </Button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-[var(--border-color)]">
                   <th className="px-4 py-4 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Date</th>
                   <th className="px-4 py-4 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Device ID</th>
                   <th className="px-4 py-4 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Virus name</th>
                   <th className="px-4 py-4 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">File Path</th>
                   <th className="px-4 py-4 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right">File Type</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-color)]/30">
                 {loading ? (
                   [1, 2, 3].map(i => (
                     <tr key={i}>
                       <td className="px-4 py-5"><Skeleton className="h-4 w-20" /></td>
                       <td className="px-4 py-5"><Skeleton className="h-4 w-24" /></td>
                       <td className="px-4 py-5"><Skeleton className="h-5 w-32" /></td>
                       <td className="px-4 py-5"><Skeleton className="h-3 w-40" /></td>
                       <td className="px-4 py-5"><Skeleton className="h-4 w-12 ml-auto" /></td>
                     </tr>
                   ))
                 ) : (
                   history.slice(0, 3).map((row, i) => (
                     <tr key={i} className="hover:bg-[var(--background-secondary)] transition-colors group">
                       <td className="px-4 py-5 text-xs font-medium text-[var(--foreground-secondary)]">{new Date(row.timestamp).toLocaleDateString()}</td>
                       <td className="px-4 py-5 text-xs font-bold text-[var(--foreground-secondary)]">{row.id.slice(0, 8)}</td>
                       <td className="px-4 py-5 text-sm font-bold text-[var(--foreground)]">{row.target}</td>
                       <td className="px-4 py-5 font-mono text-[9px] text-[var(--foreground-muted)] max-w-[150px] truncate">{row.target}</td>
                       <td className="px-4 py-5 text-xs font-bold text-[var(--foreground-secondary)] text-right">{row.type}</td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </Card>

        <Card className="lg:col-span-1 p-5 md:p-8 border-none bg-[var(--background-secondary)]">
           <div className="w-full flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-[var(--foreground)]">Threat by device</h3>
             <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
           </div>

           <div className="space-y-6">
              {deviceData.map((device, i) => (
                <div key={i} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[var(--surface)] rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Monitor className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-0.5 tracking-tight">Device ID</p>
                        <p className="text-xs font-bold text-[var(--foreground)] tracking-wide">{device.id}</p>
                      </div>
                   </div>
                   <div className="relative w-8 h-8">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="16" cy="16" r="14" stroke="var(--background)" strokeWidth="3" fill="none" />
                         <circle 
                            cx="16" 
                            cy="16" 
                            r="14" 
                            stroke={device.status > 50 ? '#ef4444' : '#f59e0b'} 
                            strokeWidth="3" 
                            fill="none" 
                            strokeDasharray="88" 
                            strokeDashoffset={88 - (device.status / 100 * 88)} 
                         />
                      </svg>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};

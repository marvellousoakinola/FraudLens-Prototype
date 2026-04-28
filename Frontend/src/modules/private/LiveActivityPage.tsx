import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  Globe, 
  Terminal, 
  Cpu, 
  Signal, 
  Wifi, 
  Zap,
  MoreVertical,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../../components/ui';
import { motion, AnimatePresence } from 'motion/react';

import { logService, ActivityLog } from '../../services/logService';

export const LiveActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const fetchLogs = async () => {
      try {
        const newBatch = await logService.getLiveLogs();
        setLogs(prev => [...newBatch, ...prev].slice(0, 50));
      } catch (error) {
        console.error("Error fetching live logs:", error);
      }
    };

    fetchLogs(); // Initial fetch

    const interval = setInterval(fetchLogs, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl relative">
              <Activity className="w-6 h-6 text-emerald-500" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Live Security Activity</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Real-time global telemetry and system-wide security events.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 transition-all w-full sm:w-auto",
              isPaused ? "text-amber-500 border-amber-500/30" : "text-emerald-500 border-emerald-500/30"
            )}
          >
            {isPaused ? <Zap className="w-4 h-4 fill-amber-500 shrink-0" /> : <RefreshCw className="w-4 h-4 animate-spin-slow shrink-0" />}
            {isPaused ? 'Resume Feed' : 'Live Monitoring'}
          </Button>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 w-full sm:w-auto" onClick={() => alert('Feature coming soon!')}>
            Export Stream
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 md:p-8">
        {/* Real-time Telemetry Stats */}
        <div className="lg:col-span-1 space-y-4">
            {[
             { label: 'Active Streams', value: '0', icon: Signal, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'Detonation Frequency', value: '0/s', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'Ingress Volume', value: '0 GB', icon: Wifi, color: 'text-primary', bg: 'bg-primary/10' },
             { label: 'Nodes Operational', value: '0/14', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
           ].map((stat, i) => (
             <Card key={i} className="p-4 sm:p-5 border-none bg-[var(--surface)] group hover:bg-[var(--background-secondary)] transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-0.5">{stat.label}</p>
                    <h3 className="text-xl font-black text-[var(--foreground)]">{stat.value}</h3>
                  </div>
                </div>
             </Card>
           ))}

           <Card className="p-6 border-none bg-gradient-to-br from-[var(--background-secondary)] to-rose-500/5 mt-8 border border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-rose-500" />
                <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.2em]">Priority Alerts</h4>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <p className="text-[10px] font-bold text-rose-500 mb-1">UNAUTHORIZED_ACCESS_ATTEMPT</p>
                  <p className="text-xs font-bold text-[var(--foreground)]">Origin: 104.22.4.11</p>
                  <p className="text-[9px] font-medium text-[var(--foreground-muted)] mt-1">2 minutes ago</p>
                </div>
              </div>
           </Card>
        </div>

        {/* Live Stream Terminal */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none bg-[var(--surface)] overflow-hidden flex flex-col h-[400px] sm:h-[650px]">
            <div className="px-4 sm:px-8 py-4 border-b border-[var(--border-color)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4 z-10 sticky top-0">
               <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-primary shrink-0" />
                 <h2 className="text-xs sm:text-sm font-black text-[var(--foreground)] uppercase tracking-tight text-center sm:text-left">System Telemetry Stream</h2>
               </div>
               <div className="flex items-center gap-4 sm:gap-6">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Connected</span>
                 </div>
                 <Badge variant="info">Sync: 14ms</Badge>
               </div>
            </div>

            <div className="flex-grow overflow-x-auto p-0 scrollbar-hide">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--surface)] sticky top-[-1px] z-10">
                    <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Event Time</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Source Entity</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Operational Action</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right">Security Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]/30">
                  <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                      <motion.tr 
                        key={`${log.id}-${i}`}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-[var(--foreground)]/5 transition-colors group"
                      >
                        <td className="px-4 sm:px-8 py-3 sm:py-4 font-mono text-[10px] text-[var(--foreground-muted)]">{log.timestamp}</td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4">
                           <div className="flex items-center gap-2">
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]",
                               log.type === 'inbound' ? 'text-blue-500' : log.type === 'outbound' ? 'text-amber-500' : 'text-emerald-500'
                             )} />
                             <span className="text-[11px] font-bold text-[var(--foreground-secondary)]">{log.source}</span>
                           </div>
                        </td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4">
                          <p className="text-[11px] font-black text-[var(--foreground)] leading-tight">{log.action}</p>
                          <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-tight">Target: {log.target}</p>
                        </td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4 text-right">
                           <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded border",
                              log.severity === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' :
                              log.severity === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              log.severity === 'medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-[var(--foreground-muted)] border-slate-500/10'
                           )}>
                             {log.severity}
                           </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--background)] flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                 <span className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Engine: Hyper-Scan 9.0</span>
                 <span className="flex items-center gap-2"><ArrowUpRight className="w-3.5 h-3.5" /> Throughput: 429 tx/s</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="flex space-x-0.5">
                   {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                     <div key={i} className="w-1 bg-primary/30" style={{ height: `${h * 4}px` }} />
                   ))}
                 </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

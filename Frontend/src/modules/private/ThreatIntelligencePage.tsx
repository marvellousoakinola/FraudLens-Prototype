import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Globe, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Cpu, 
  Zap, 
  LayoutGrid, 
  MoreVertical,
  Activity,
  AlertTriangle,
  Server,
  Terminal,
  ChevronRight,
  Bell,
  BellRing
} from 'lucide-react';
import { Card, Badge, Button, cn, Skeleton } from '../../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { intelService, ThreatActor } from '../../services/intelService';

export const ThreatIntelligencePage: React.FC = () => {
  const [actors, setActors] = useState<ThreatActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribedActors, setSubscribedActors] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await intelService.getActors();
        setActors(res);
      } catch (error) {
        console.error("Error fetching actors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActors();
  }, []);

  const toggleSubscription = (actorName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubscribedActors(prev => {
      const next = new Set(prev);
      if (next.has(actorName)) {
        next.delete(actorName);
        setNotification(`Unsubscribed from ${actorName} alerts.`);
      } else {
        next.add(actorName);
        setNotification(`Subscribed to real-time alerts for ${actorName}.`);
      }
      setTimeout(() => setNotification(null), 3000);
      return next;
    });
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 px-6 py-3 bg-[var(--surface)] border border-[var(--border-main)] shadow-2xl rounded-full flex items-center gap-3 backdrop-blur-md"
          >
            <BellRing className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold text-[var(--foreground)]">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl">
              <Globe className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Active Threat Intelligence</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Live synchronization with global honeypots and threat actors' infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 text-indigo-400 border-indigo-500/20" onClick={() => alert('Feature coming soon!')}>
            <Zap className="w-4 h-4 fill-indigo-500" /> Syncing Live
          </Button>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>
            Export Intelligence
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Actors', value: '0', icon: Activity, color: 'text-amber-500', trend: 'Base Baseline' },
          { label: 'Infrastructure Nodes', value: '0', icon: Server, color: 'text-indigo-400', trend: 'Waiting sync' },
          { label: 'Exploit Kits', value: '0', icon: ShieldAlert, color: 'text-rose-500', trend: 'Secured' },
          { label: 'Global Confidence', value: '0.0%', icon: Zap, color: 'text-primary', trend: 'Standby' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-none bg-[var(--surface)] hover:bg-[var(--background-secondary)] transition-all group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all">
                <stat.icon className="w-16 h-16 text-[var(--foreground)]" />
             </div>
             <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{stat.value}</h3>
             <div className="flex items-center gap-1.5">
                <span className={cn("text-[9px] font-black uppercase tracking-tighter", stat.color)}>{stat.trend}</span>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Global Map Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-[var(--surface)] overflow-hidden relative min-h-[500px] flex flex-col items-center justify-center">
             <div className="absolute top-0 left-0 w-full p-5 md:p-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                   <MapPin className="w-5 h-5 text-rose-500" />
                   <div>
                     <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">Geo-Spatial Threat Vector</h3>
                     <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Global Detonation Map</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Critical Outbreak: South Asia</span>
                   </div>
                </div>
             </div>
             
             {/* Schematic Map Placeholder */}
             <div className="relative w-full h-[400px] opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-hover)_0%,transparent_70%)] opacity-10" />
                <svg viewBox="0 0 1000 500" className="w-full h-full fill-[var(--background-secondary)]">
                  <path d="M150,200 L850,200 L950,450 L50,450 Z" className="opacity-10" />
                  <path d="M200,250 Q500,100 800,250" stroke="var(--primary)" strokeWidth="1" fill="none" className="animate-pulse" />
                  <circle cx="200" cy="250" r="4" fill="var(--danger)" className="animate-ping" />
                  <circle cx="800" cy="250" r="4" fill="var(--danger)" />
                  <circle cx="500" cy="150" r="2" fill="var(--primary)" />
                </svg>
             </div>

             <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 border-t border-[var(--border-color)] bg-[var(--background)]/80 backdrop-blur-md">
                <div className="grid grid-cols-3 gap-5 md:p-8">
                   {[
                     { label: 'Ingress Point', val: 'TCP/443 Relay' },
                     { label: 'Active Vector', val: 'Brute-Force (SSH)' },
                     { label: 'Risk Delta', val: '+24.1% Critical' },
                   ].map((item, i) => (
                     <div key={i}>
                        <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-black text-[var(--foreground)]">{item.val}</p>
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </div>

        {/* Tactical Intel Feed */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none bg-[var(--surface)] overflow-hidden flex flex-col h-[500px]">
              <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Actor Signature Bank</h3>
                </div>
                <Badge variant="info">Live Feed</Badge>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                 {loading ? (
                   <div className="py-20 text-center">
                     <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic animate-pulse">Syncing signatures...</p>
                   </div>
                 ) : actors.length === 0 ? (
                   <div className="py-20 text-center">
                     <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic">Awaiting actor synchronization telemetry...</p>
                   </div>
                 ) : (
                   actors.map((actor, i) => (
                     <div key={i} className="p-4 rounded-xl bg-[var(--background-secondary)]/50 border border-[var(--border-color)] hover:border-primary/30 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-black text-[var(--foreground)] group-hover:text-primary transition-colors uppercase tracking-tight">{actor.name}</h4>
                          <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--background-secondary)] border border-[var(--border-color)]", actor.color)}>{actor.risk}</span>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                             <Globe className="w-3 h-3 text-[var(--foreground-muted)]" />
                             <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{actor.origin}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <button
                               onClick={(e) => toggleSubscription(actor.name, e)}
                               className="p-1.5 rounded-lg hover:bg-[var(--background)] border border-transparent hover:border-[var(--border-color)] transition-all z-10"
                               title="Subscribe to alerts for this actor"
                             >
                                <Bell className={cn("w-3.5 h-3.5 transition-all opacity-50 group-hover:opacity-100", subscribedActors.has(actor.name) ? "fill-primary text-primary opacity-100" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]")} />
                             </button>
                             <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>
              <div className="p-4 bg-[var(--background)] border-t border-[var(--border-color)]">
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.2em] font-mono text-[var(--foreground-muted)] hover:text-[var(--foreground)]" onClick={() => alert('Feature coming soon!')}>
                    Decrypt Intelligence Data
                 </Button>
              </div>
           </Card>

           <Card className="p-6 border-none bg-[var(--surface)] relative group overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> Behavioral Sinkhole
                </h3>
                <p className="text-xs font-medium text-[var(--foreground-muted)] leading-snug">Redirecting 1,240,432 packets to our deep-detonation sinkhole cluster. 99.1% efficiency recorded.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-24 h-24 text-[var(--foreground)]" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

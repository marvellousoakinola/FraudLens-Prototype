import React from 'react';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Target, 
  Cpu, 
  LineChart, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertCircle,
  Terminal,
  Activity,
  Lightbulb,
  Search,
  MessageSquare
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../../components/ui';
import { motion } from 'motion/react';

export const AIInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl relative">
              <Sparkles className="w-6 h-6 text-primary" />
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">AI Augmented Insights</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Autonomous neural-network based threat prediction and behavior extraction.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="h-10 px-4 bg-primary/5 border-primary/20 text-primary font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Brain className="w-4 h-4" /> FraudLens AI Active
          </Badge>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>
            Query AI Agent
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Main AI Extraction Section */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-6 md:p-10 border-none bg-[var(--surface)] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                 <Brain className="w-48 h-48 text-primary shadow-[0_0_100px_rgba(124,58,237,0.5)]" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Target className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                     <h3 className="text-md font-black text-[var(--foreground)] uppercase tracking-tight">Predictive Threat Model</h3>
                     <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Next-Gen Heuristic Extraction</p>
                   </div>
                 </div>

                 <div className="space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:p-8">
                      {[
                        { label: 'Neural Accuracy', val: '99.92%', status: 'optimal' },
                        { label: 'Pattern Delta', val: '14,024', status: 'high' },
                        { label: 'Extraction Latency', val: '8.4ms', status: 'optimal' },
                      ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                           <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest leading-tight">{stat.label}</p>
                           <h4 className="text-2xl font-black text-[var(--foreground)] tracking-tighter">{stat.val}</h4>
                           <div className={cn(
                             "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase",
                             stat.status === 'optimal' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                           )}>
                             {stat.status}
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="p-5 md:p-8 rounded-3xl bg-[var(--background-secondary)]/80 border border-[var(--border-color)] backdrop-blur-sm relative overflow-hidden group-hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                            <span className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest">Autonomous Suggestion</span>
                         </div>
                         <Badge variant="info">Priority High</Badge>
                      </div>
                      <p className="text-base font-bold text-[var(--foreground-secondary)] leading-relaxed italic border-l-2 border-primary pl-6 py-2">
                         "AI models detected a coordinated shift in SSL fingerprinting patterns across South Asian ingress nodes. Recommending immediate quarantine for all 'unregistered-vps' host signatures."
                      </p>
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3">
                         <Button variant="ghost" size="sm" className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]" onClick={() => alert('Feature coming soon!')}>Dismiss Intelligence</Button>
                         <Button size="sm" className="w-full sm:w-auto h-9 px-6 text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-[var(--foreground)] shadow-lg shadow-emerald-500/20 border-none" onClick={() => alert('Feature coming soon!')}>Execute Pattern Block</Button>
                      </div>
                   </div>
                 </div>
              </div>
           </Card>

           <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Semantic Log Analysis', icon: Terminal, desc: 'Converting raw binary dumps into human-readable tactical summaries.' },
                { title: 'Behavioral Sandbox', icon: Cpu, desc: 'AI-driven detonation mimics user intent to trigger dormant payloads.' },
              ].map((card, i) => (
                <Card key={i} className="p-5 md:p-8 border-none bg-[var(--surface)] group hover:bg-[var(--background-secondary)] transition-all">
                   <div className="p-3 bg-primary/10 rounded-xl mb-6 w-fit group-hover:scale-110 transition-transform">
                      <card.icon className="w-6 h-6 text-primary" />
                   </div>
                   <h4 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest mb-2">{card.title}</h4>
                   <p className="text-xs font-semibold text-[var(--foreground-muted)] leading-relaxed">{card.desc}</p>
                </Card>
              ))}
           </div>
        </div>

        {/* Sidebar Mini Insights */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--surface)] flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.2em]">Neural Sync Feed</h3>
                 </div>
                 <Badge variant="success">Sync Live</Badge>
              </div>

              <div className="space-y-8">
                 {[
                   { label: 'Ingress Heuristics', val: '99.4%', status: 'Sync-Stable' },
                   { label: 'Extraction Confidence', val: '82%', status: 'Mining' },
                   { label: 'Relay Convergence', val: '14ms', status: 'Propagating' },
                   { label: 'Threat Signature Hash', val: 'v2.4.9', status: 'Updated' },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{item.label}</span>
                       <span className="text-[9px] font-black text-[var(--foreground-muted)] uppercase italic">{item.status}</span>
                     </div>
                     <div className="h-1 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: item.val }}
                         className={cn(
                           "h-full rounded-full",
                           i === 0 ? "bg-emerald-500" : "bg-primary"
                         )}
                       />
                     </div>
                     <span className="text-xs font-black text-[var(--foreground)]">{item.val}</span>
                   </div>
                 ))}
              </div>

              <Card className="mt-auto p-4 bg-[var(--background-secondary)]/50 border-[var(--border-color)] border-dashed">
                 <div className="flex items-start gap-3">
                   <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                   <div>
                     <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">AI Chat Support</p>
                     <p className="text-xs font-bold text-[var(--foreground-secondary)] leading-snug">Ask AI about any specific scan or anomaly signature.</p>
                   </div>
                 </div>
              </Card>
           </Card>
        </div>
      </div>
    </div>
  );
};

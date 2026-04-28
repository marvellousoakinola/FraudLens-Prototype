import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Chrome, 
  MessageSquare, 
  Zap, 
  ShieldAlert, 
  Cpu,
  Monitor,
  MoreVertical,
  Check,
  Globe,
  Plus
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../../../components/ui';

export const NotificationsPage: React.FC = () => {
  const [channels, setChannels] = useState([
    { id: 'email', label: 'Email Communication', active: true, icon: Mail, desc: 'Detailed PDF reports and security audit summaries.' },
    { id: 'push', label: 'Push Notifications', active: false, icon: Smartphone, desc: 'Real-time alerts for critical vector detonations.' },
    { id: 'desktop', label: 'Desktop Overlays', active: true, icon: Monitor, desc: 'System-wide activity log popups in your dashboard.' },
    { id: 'webhooks', label: 'API Webhooks', active: false, icon: Zap, iconColor: 'text-primary', desc: 'JSON payloads sent to your custom integration endpoints.' },
  ]);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const [categoryConfigs, setCategoryConfigs] = useState([
    { id: 'security', title: 'Security Outbreaks', desc: 'Alerts for malware detections and suspicious pattern matches.', frequency: 'Immediate', active: true },
    { id: 'telemetry', title: 'Infrastructure Telemetry', desc: 'Updates on node status and bandwidth ingestion limits.', frequency: 'Daily Digest', active: true },
    { id: 'billing', title: 'Billing & Quota', desc: 'Notifications regarding your subscription and API usage.', frequency: 'Immediate', active: true },
    { id: 'training', title: 'Model Training Updates', desc: 'Extraction engine versioning and heuristic model deployments.', frequency: 'Silent', active: false },
  ]);

  const toggleCategory = (id: string) => {
    setCategoryConfigs(prev => prev.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat));
  };

  const updateFrequency = (id: string, freq: string) => {
    setCategoryConfigs(prev => prev.map(cat => cat.id === id ? { ...cat, frequency: freq } : cat));
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Notification Channels</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Configure how and when the FraudLens engine communicates with your team.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => alert('Feature coming soon!')}>
            Reset Broadcast Config
          </Button>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>
            Save Preferences
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Active Channels */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--surface)] space-y-8">
              <h3 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4">Transmission Channels</h3>
              {channels.map((ch) => (
                <div key={ch.id} className="group flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all shrink-0",
                    ch.active ? "bg-primary/20 text-primary" : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] opacity-60"
                  )}>
                    <ch.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1.5">
                       <p className={cn("text-sm font-extrabold tracking-tight", ch.active ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]")}>{ch.label}</p>
                       <button 
                         onClick={() => toggleChannel(ch.id)}
                         className={cn(
                           "w-8 h-4 rounded-full relative transition-all duration-300",
                           ch.active ? "bg-primary" : "bg-[var(--background-secondary)]"
                         )}
                       >
                         <div className={cn(
                           "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300",
                           ch.active ? "left-[17px]" : "left-1"
                         )} />
                       </button>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] leading-relaxed uppercase tracking-tighter">{ch.desc}</p>
                  </div>
                </div>
              ))}
           </Card>

           <Card className="p-6 border-none bg-[var(--surface)] group cursor-pointer hover:bg-primary/5 transition-all border border-dashed border-[var(--border-color)] border-spacing-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-primary" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Add Custom Relay</h4>
                    <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase">Integrate Slack or MS Teams</p>
                 </div>
              </div>
           </Card>
        </div>

        {/* Categories / Frequency */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-6 md:p-10 border-none bg-[var(--surface)] overflow-hidden">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Cpu className="w-4 h-4 text-emerald-500" />
                 </div>
                 <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Extraction Categories & Priority</h3>
              </div>

              <div className="space-y-6">
                 {categoryConfigs.map((cat) => (
                   <div key={cat.id} className={cn(
                     "flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border transition-all group relative overflow-hidden",
                     cat.active 
                       ? "bg-[var(--background-secondary)]/50 border-[var(--border-color)] hover:border-primary/30" 
                       : "bg-[var(--surface)] border-[var(--border-color)] opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                   )}>
                      {!cat.active && (
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                      )}
                      <div className="space-y-1 flex-grow">
                         <div className="flex items-center gap-3">
                            <h4 className={cn("text-sm font-black tracking-tight", cat.active ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]")}>{cat.title}</h4>
                            <Badge variant={cat.active ? "success" : "secondary"} className="text-[8px] h-4">
                              {cat.active ? 'Broadcasting' : 'Muted'}
                            </Badge>
                         </div>
                         <p className="text-xs font-semibold text-[var(--foreground-muted)] leading-relaxed max-w-md">{cat.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest leading-none">Frequency</span>
                          <select 
                            disabled={!cat.active}
                            value={cat.frequency}
                            onChange={(e) => updateFrequency(cat.id, e.target.value)}
                            className="bg-[var(--surface)] border border-[var(--border-color)] text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest rounded-lg px-4 py-2 outline-none focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                             <option value="Immediate">Immediate</option>
                             <option value="Hourly">Hourly</option>
                             <option value="Daily Digest">Daily Digest</option>
                             <option value="Silent">Silent</option>
                          </select>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest leading-none text-center">Status</span>
                          <button 
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                              "w-10 h-5 rounded-full relative transition-all duration-300",
                              cat.active ? "bg-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]" : "bg-slate-800"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
                              cat.active ? "left-6" : "left-1"
                            )} />
                          </button>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-12 pt-10 border-t border-[var(--border-color)] flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest mb-1.5">Critical Overrides Enabled</h4>
                    <p className="text-xs font-medium text-[var(--foreground-muted)] leading-relaxed px-1 border-l-2 border-primary/30 ml-1">
                      Critical-Tier outbreaks will bypass all suppression filters and transmit via emergency communication relays automatically.
                    </p>
                 </div>
              </div>
           </Card>

           <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-5 md:p-8 border-none bg-[var(--surface)] group cursor-pointer relative overflow-hidden">
                 <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                       <Globe className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Enabled</span>
                 </div>
                 <h4 className="text-xs font-black text-[var(--foreground)] uppercase tracking-widest mb-2 relative z-10">Global Sync Check</h4>
                 <p className="text-[10px] font-semibold text-[var(--foreground-muted)] leading-relaxed relative z-10">Heartbeat check sent to all nodes every 10 seconds. Recommended for multi-region admins.</p>
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 rotate-12 translate-x-12 translate-y-4 group-hover:scale-110 transition-transform" />
              </Card>

              <Card className="p-5 md:p-8 border-none bg-[var(--surface)] group cursor-pointer relative overflow-hidden">
                 <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                       <MessageSquare className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Disabled</span>
                 </div>
                 <h4 className="text-xs font-black text-[var(--foreground)] uppercase tracking-widest mb-2 relative z-10">Marketing Ingress</h4>
                 <p className="text-[10px] font-semibold text-[var(--foreground-muted)] leading-relaxed relative z-10">Product updates, feature releases and ecosystem newsletters. (No system priority)</p>
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 rotate-12 translate-x-12 translate-y-4 group-hover:scale-110 transition-transform" />
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};

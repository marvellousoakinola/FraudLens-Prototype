import React, { useState } from 'react';
import { 
  Terminal, 
  Key, 
  RefreshCw, 
  Copy, 
  Check, 
  Shield, 
  Trash,
  ShieldMinus,
  ExternalLink, 
  Plus, 
  Zap, 
  Cpu, 
  Lock,
  MoreVertical,
  Code2,
  Server
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../../../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const APIAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [token, setToken] = useState("fl_live_51MszO8K7sR6fB8zO8K7sR6fB8zO8K7sR6fB");
  const [tempNewToken, setTempNewToken] = useState<string | null>(null);
  const [secondaryKeys, setSecondaryKeys] = useState([
    { id: '1', label: 'E-Discovery Integration', token: 'fl_live_v8...d2s', created: '2026-02-12', scope: 'Read-Only' },
    { id: '2', label: 'Discord Sec-Bot', token: 'fl_live_z1...9pp', created: '2026-03-05', scope: 'Full Access' },
  ]);

  const revokeKey = (id: string) => {
    setSecondaryKeys(prev => prev.filter(k => k.id !== id));
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewToken = () => {
    const newToken = "fl_live_" + Math.random().toString(36).substr(2, 20) + Math.random().toString(36).substr(2, 20);
    setTempNewToken(newToken);
    setIsRotating(true);
    setShowConfirm(false);
  };

  const finalizeRotation = () => {
    if (tempNewToken) {
      setToken(tempNewToken);
      setTempNewToken(null);
      setIsRotating(false);
      setApiKeyVisible(true);
    }
  };

  const activity = [
    { endpoint: 'POST /v1/scan/url', status: 200, time: '2 mins ago', latency: '42ms' },
    { endpoint: 'GET /v1/intel/signatures', status: 200, time: '14 mins ago', latency: '12ms' },
    { endpoint: 'POST /v1/detonate', status: 403, time: '1h ago', latency: '8ms' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">API Infrastructure Access</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Integrate the FraudLens detonation engine directly into your tactical workflow.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 w-full sm:w-auto" onClick={() => alert('Feature coming soon!')}>
            <Server className="w-4 h-4 shrink-0" /> Endpoint Status
          </Button>
          <Button size="sm" onClick={() => setShowConfirm(true)} className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4 shrink-0" /> New Access Token
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Lock className="w-32 h-32 text-primary" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/10 rounded-lg">
                          <Key className="w-4 h-4 text-primary" />
                       </div>
                       <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Primary Access Token</h3>
                    </div>
                    <Badge variant="success">Active • Production</Badge>
                 </div>

                 <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Live Secret Key</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                         <div className="flex-grow h-14 bg-[var(--surface)] border border-[var(--border-main)] rounded-2xl flex items-center px-4 sm:px-6 relative overflow-hidden group/key cursor-pointer" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                            <div className={cn(
                               "font-mono text-sm tracking-wider transition-all duration-300",
                               apiKeyVisible ? "text-[var(--foreground)] blur-none" : "text-[var(--foreground-muted)] blur-[4px]"
                            )}>
                               {token}
                            </div>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/key:opacity-100 transition-opacity flex items-center justify-center">
                               <p className="text-[10px] font-black text-primary uppercase tracking-widest">{apiKeyVisible ? 'Hide Key' : 'Reveal Key'}</p>
                            </div>
                         </div>
                         <Button 
                            variant="outline" 
                            className="w-14 h-14 shrink-0 rounded-2xl border-[var(--border-main)] bg-[var(--surface)] hover:bg-primary hover:border-primary transition-all p-0"
                            onClick={() => copyToClipboard(token)}
                         >
                            {copied ? <Check className="w-5 h-5 text-[var(--foreground)]" /> : <Copy className="w-5 h-5 text-[var(--foreground-muted)] hover:text-[var(--foreground)]" />}
                         </Button>
                      </div>
                      <p className="text-[10px] font-semibold text-rose-500/80 uppercase tracking-widest flex items-center gap-2 mt-2 px-1">
                        <Shield className="w-3 h-3" /> Never expose this token in client-side codebases.
                      </p>
                   </div>
                 </div>

                 <div className="mt-10 pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border-main)] flex items-center justify-center">
                          <Terminal className="w-5 h-5 text-[var(--foreground-muted)]" />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-tight">System Rollover</h4>
                          <p className="text-[10px] font-bold text-[var(--foreground-muted)]">Scheduled for August 14, 2026</p>
                       </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowConfirm(true)}
                      className="text-[10px] font-black uppercase tracking-widest h-11 px-6 border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-[var(--foreground)] transition-all gap-2"
                    >
                       <RefreshCw className="w-4 h-4" /> Rotate Credentials
                    </Button>
                 </div>
              </div>

              {/* Confirmation Overlay */}
              <AnimatePresence>
                {showConfirm && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[var(--background-secondary)]/95 backdrop-blur-md flex items-center justify-center p-5 md:p-8 text-center"
                  >
                    <div className="max-w-xs space-y-6">
                       <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin-slow" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight mb-2">Rotate Token?</h3>
                          <p className="text-xs font-medium text-[var(--foreground-muted)] leading-relaxed">The current token will remain valid until you finalize the new one. All active integrations will need to be updated.</p>
                       </div>
                       <div className="flex gap-3">
                          <Button variant="ghost" className="flex-1 text-[10px] uppercase font-black tracking-widest" onClick={() => setShowConfirm(false)}>Cancel</Button>
                          <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-[10px] uppercase font-black tracking-widest" onClick={generateNewToken}>Rotate</Button>
                       </div>
                    </div>
                  </motion.div>
                )}

                {isRotating && tempNewToken && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-50 bg-primary/95 backdrop-blur-xl flex items-center justify-center p-5 md:p-8 text-center"
                  >
                    <div className="max-w-md space-y-8">
                       <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                          <Zap className="w-10 h-10 text-[var(--foreground)] fill-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-2">New Token Generated</h3>
                          <p className="text-sm font-bold text-white/70 leading-relaxed italic">"Infrastructure success. Copy the secret key below before finalizing."</p>
                       </div>
                       
                       <div className="bg-black/20 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 group">
                          <code className="flex-grow font-mono text-sm text-[var(--foreground)] break-all text-left">{tempNewToken}</code>
                          <Button 
                            className="h-12 w-12 rounded-xl bg-white text-primary hover:bg-slate-50 transition-all p-0 shrink-0 shadow-lg"
                            onClick={() => copyToClipboard(tempNewToken)}
                          >
                             {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </Button>
                       </div>

                       <div className="flex flex-col gap-4">
                          <Button 
                            className="w-full h-14 bg-white text-primary hover:bg-slate-50 text-xs font-black uppercase tracking-[0.2em] shadow-2xl"
                            onClick={finalizeRotation}
                          >
                             Apply New Token
                          </Button>
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Applying will invalidate the previous key instantly</p>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </Card>           <Card className="border-none bg-[var(--background-secondary)] overflow-hidden mb-6">
            <div className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)]">
                 <div className="flex items-center gap-3">
                   <ShieldMinus className="w-4 h-4 text-primary shrink-0" />
                   <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest truncate">Secondary Key Registry</h3>
                 </div>
                 <Button variant="ghost" size="sm" className="self-start sm:self-auto h-8 px-3 text-[9px] font-black uppercase text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors w-full sm:w-auto" onClick={() => alert('Feature coming soon!')}>
                   Manage Scopes
                 </Button>
              </div>
              <div className="p-2 space-y-1">
                <AnimatePresence>
                  {secondaryKeys.map((key) => (
                    <motion.div 
                      key={key.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl hover:bg-[var(--foreground)]/[0.02] transition-all border border-transparent hover:border-[var(--foreground)]/5"
                    >
                      <div className="flex flex-col mb-4 md:mb-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[var(--foreground)] tracking-wide">{key.label}</span>
                          <span className="text-[9px] font-black text-[var(--foreground-muted)] bg-[var(--surface)] px-1.5 py-0.5 rounded uppercase tracking-tighter">{key.scope}</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <code className="text-[10px] font-mono text-[var(--foreground-secondary)] break-all max-w-[200px] sm:max-w-none">{key.token}</code>
                          <span className="hidden sm:inline text-[10px] text-[var(--foreground-muted)]">•</span>
                          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">Created {key.created}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-auto">
                         <Button 
                           variant="outline" 
                           className="h-8 w-8 rounded-lg border-[var(--foreground)]/5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)] p-0"
                           onClick={() => copyToClipboard(key.token)}
                         >
                           <Copy className="w-3.5 h-3.5" />
                         </Button>
                         <Button 
                           variant="outline" 
                           className="h-8 w-8 rounded-lg border-rose-500/10 bg-rose-500/5 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 p-0"
                           onClick={() => revokeKey(key.id)}
                         >
                           <Trash className="w-3.5 h-3.5" />
                         </Button>
                      </div>
                    </motion.div>
                  ))}
                  {secondaryKeys.length === 0 && (
                    <div className="py-12 text-center">
                       <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest leading-relaxed">No secondary keys provisioned.<br />Use the 'New Access Token' action to create scoped keys.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
           </Card>

           <Card className="border-none bg-[var(--background-secondary)] overflow-hidden">
             <div className="px-5 sm:px-8 py-5 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <Zap className="w-4 h-4 text-primary shrink-0" />
                   <h3 className="text-[10px] sm:text-xs font-black text-[var(--foreground)] uppercase tracking-widest truncate">Recent Ingress Activity</h3>
                </div>
                <Badge variant="info" className="self-start sm:self-auto">Protocol v1.4</Badge>
             </div>
             <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Method & Resource</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Result</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Latency</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30">
                    {activity.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--foreground)]/[0.01] transition-colors group">
                        <td className="px-4 sm:px-8 py-3 sm:py-4">
                           <span className="font-mono text-xs font-black tracking-tight text-[var(--foreground)]">{row.endpoint}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4">
                           <span className={cn(
                             "text-[10px] font-black px-2 py-0.5 rounded border",
                             row.status === 200 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                           )}>
                             {row.status}
                           </span>
                        </td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4 font-mono text-[10px] text-[var(--foreground-muted)]">{row.latency}</td>
                        <td className="px-4 sm:px-8 py-3 sm:py-4 text-right">
                           <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{row.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </Card>
        </div>

        {/* Sidebar Info/Docs */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-primary h-fit shadow-2xl shadow-primary/20 group cursor-pointer relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <Code2 className="w-6 h-6 text-[var(--foreground)]" />
                 </div>
                 <h3 className="text-xl font-black text-[var(--foreground)] mb-2 tracking-tight">Integration Labs</h3>
                 <p className="text-xs font-bold text-white/70 leading-relaxed mb-8">Comprehensive SDKs for Python, Node.js and Go. Build autonomous security loops with FraudLens.</p>
                 <button className="flex items-center gap-2 text-[var(--foreground)] font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all" onClick={() => navigate('/settings/documentation')}>
                    Browse Documentation <ExternalLink className="w-4 h-4" />
                 </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20 transform group-hover:scale-110 transition-transform">
                 <Terminal className="w-32 h-32 text-black" />
              </div>
           </Card>

           <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                 </div>
                 <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Rate Limiting</h4>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-[var(--foreground-muted)]">Tier 2 Ingress</span>
                       <span className="text-[var(--foreground)]">5,042 / 10,000 requests</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full w-[50.4%]" />
                    </div>
                 </div>
                 <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase leading-relaxed italic">Limit resets in 4 hours, 12 minutes.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff,
  History,
  Monitor,
  Trash2,
  ChevronRight,
  Fingerprint,
  Zap,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../../../components/ui';
import { motion } from 'motion/react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-500/10 rounded-xl">
              <Lock className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Security & Encryption</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Manage encryption keys, authentication layers, and session ledger.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="danger" className="h-10 px-4 bg-rose-500/5 border-rose-500/20 text-rose-500 font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> 2FA Suggested
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Authentication Settings */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-6 md:p-10 border-none bg-[var(--surface)]">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="w-4 h-4 text-primary" />
                 </div>
                 <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Authentication Layers</h3>
              </div>

              <div className="space-y-8">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[var(--background-secondary)]/50 border border-[var(--border-color)] group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                          <Smartphone className="w-6 h-6 text-indigo-500" />
                       </div>
                       <div>
                          <p className="text-sm font-extrabold text-[var(--foreground)] tracking-tight mb-1">Two-Factor Authentication (2FA)</p>
                          <p className="text-xs font-semibold text-[var(--foreground-muted)]">Enhanced security via authenticator app or hardware token.</p>
                       </div>
                    </div>
                    <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-10 border-[var(--border-color)] bg-transparent group-hover:bg-primary group-hover:border-primary transition-all" onClick={() => alert('Feature coming soon!')}>
                       Configure Layer
                    </Button>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-[var(--border-color)] space-y-8">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Update Access Code</h4>
                    <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase italic">Last changed: 42 days ago</span>
                 </div>
                 <div className="grid md:grid-cols-2 gap-5 md:p-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Current Password</label>
                       <div className="relative">
                          <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">New System Passphrase</label>
                       <div className="relative">
                          <input type="password" placeholder="Min. 12 characters" className="w-full h-12 px-5 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all" />
                       </div>
                    </div>
                 </div>
                 <Button className="h-12 px-8 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>Update Security Token</Button>
              </div>
           </Card>

           <Card className="border-none bg-[var(--surface)] overflow-hidden">
              <div className="px-8 py-5 border-b border-[var(--border-color)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <History className="w-4 h-4 text-primary" />
                   <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Active Session Ledger</h3>
                 </div>
                 <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 text-[10px] font-extrabold uppercase tracking-widest" onClick={() => alert('Feature coming soon!')}>Logout all sessions</Button>
              </div>
              <div className="divide-y divide-[var(--border-color)]/30">
                 {[
                   { device: 'macOS - Chrome Browser', geo: 'London, UK', ip: '192.168.1.1', current: true },
                   { device: 'Desktop - FraudLens Engine V.2', geo: 'Frankfurt, GER', ip: '10.0.4.14', current: false },
                 ].map((session, i) => (
                    <div key={i} className="px-8 py-5 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-[var(--background-secondary)] rounded-xl text-[var(--foreground-muted)]">
                             <Monitor className="w-4 h-4" />
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-bold text-[var(--foreground)] tracking-tight">{session.device}</span>
                                {session.current && <Badge variant="success" className="text-[8px] h-4">Current Session</Badge>}
                             </div>
                             <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{session.geo} • {session.ip}</p>
                          </div>
                       </div>
                       {!session.current && <button className="p-2 text-[var(--foreground-muted)] hover:text-rose-500 transition-colors" onClick={() => alert('Feature coming soon!')}><Trash2 className="w-4 h-4" /></button>}
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Sidebar Mini Security Box */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--surface)] text-center">
              <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="64" cy="64" r="50" stroke="var(--border-color)" strokeWidth="8" fill="none" />
                   <circle cx="64" cy="64" r="50" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="314" strokeDashoffset="40" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[var(--foreground)] tracking-tighter">92%</span>
                    <span className="text-[8px] font-black text-[var(--foreground-muted)] uppercase">Health</span>
                 </div>
              </div>
              <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest mb-2">Security Score</h4>
              <p className="text-xs font-medium text-[var(--foreground-muted)] leading-relaxed mb-6">Your account is highly secure, but 2FA activation will complete your encryption profile.</p>
              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-[var(--border-color)] bg-transparent" onClick={() => alert('Feature coming soon!')}>Execute Hardening Audit</Button>
           </Card>

           <Card className="p-6 border-none bg-gradient-to-br from-[var(--background-secondary)] to-[#7c3ced]/10 overflow-hidden relative group">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-primary fill-primary/20" />
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.2em]">Quantum Guard</h4>
                 </div>
                 <p className="text-xs font-bold text-[var(--foreground-secondary)] mb-4 leading-snug">Enable real-time behavioral encryption for all data ingress streams.</p>
                 <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all" onClick={() => alert('Feature coming soon!')}>
                    Activate Protocol <ChevronRight className="w-3 h-3" />
                 </button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                 <Shield className="w-32 h-32 text-indigo-500" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

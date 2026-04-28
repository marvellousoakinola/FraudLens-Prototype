import React from 'react';
import { 
  CreditCard, 
  Package, 
  Zap, 
  ShieldCheck, 
  Download, 
  History, 
  ArrowUpRight, 
  AlertCircle,
  Check,
  ChevronRight,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../../../components/ui';

export const BillingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Financial & Subscription</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Manage your enterprise tier, tactical billing cycles, and invoice history.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="success" className="h-10 px-4 bg-emerald-500/5 border-emerald-500/20 text-emerald-500 font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Professional Tier
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Main Tier Info */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-1000">
                <Package className="w-48 h-48 text-primary" />
              </div>
              
              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-2 md:p-8 mb-8 md:mb-12">
                    <div>
                       <h3 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4 text-center md:text-left">Current Allocation</h3>
                       <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                          <h2 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tighter text-center sm:text-left">Pro-Tactical</h2>
                          <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                             <span className="text-[10px] font-black text-primary uppercase tracking-widest">$149.00/mo</span>
                          </div>
                       </div>
                    </div>
                    <Button className="h-12 px-8 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={() => alert('Feature coming soon!')}>Upgrade Identity Tier</Button>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 md:p-8 pt-8 md:pt-10 border-t border-[var(--border-color)]">
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" /> Active Quota Specifications
                       </h4>
                       <div className="space-y-4">
                          {[
                            { label: 'Detonation Cycles', value: '45,000 / 50k', perc: '90%' },
                            { label: 'Intelligence Records', value: 'Unlimited', perc: '100%' },
                            { label: 'Ingress Volume', value: '1.2 TB / 2 TB', perc: '60%' },
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                               <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className="text-[var(--foreground-muted)] uppercase tracking-widest">{item.label}</span>
                                  <span className="text-[var(--foreground)]">{item.value}</span>
                               </div>
                               <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                                  <div className={cn(
                                    "h-full rounded-full",
                                    i === 0 ? "bg-rose-500" : "bg-primary"
                                  )} style={{ width: item.perc }} />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[var(--foreground-muted)]" /> Payment Method Reference
                       </h4>
                       <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-main)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                             <div className="w-12 h-8 bg-[var(--background-secondary)] rounded-md border border-[var(--border-color)] flex items-center justify-center font-black text-[10px] italic skew-x-[-10deg] text-[var(--foreground)]">VISA</div>
                             <div>
                                <p className="text-xs font-bold text-[var(--foreground)] tracking-widest">•••• 4242</p>
                                <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">Exp: 12/26</p>
                             </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary p-0 h-auto font-black text-[10px] uppercase sm:self-auto self-end" onClick={() => alert('Feature coming soon!')}>Edit</Button>
                       </div>
                       <p className="text-[10px] font-bold text-[var(--foreground-muted)] leading-relaxed uppercase tracking-widest flex items-center gap-2 italic">
                         <Check className="w-3 h-3 text-emerald-500" /> Next billing sequence: June 1, 2026
                       </p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="border-none bg-[var(--background-secondary)] overflow-hidden">
              <div className="px-4 sm:px-8 py-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                   <History className="w-4 h-4 text-primary" />
                   <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Billing & Invoicing Ledger</h3>
                 </div>
                 <Button variant="outline" size="sm" className="w-full sm:w-auto h-8 text-[10px] font-black uppercase tracking-widest border-[var(--border-main)] bg-[var(--surface)] hover:bg-[var(--background-secondary)] transition-colors" onClick={() => alert('Feature coming soon!')}>Bulk Download</Button>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-[var(--border-color)]">
                          <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Reference ID</th>
                          <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Allocation Tier</th>
                          <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Amount</th>
                          <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Status</th>
                          <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right">Invoices</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30">
                       {[
                         { id: 'INV-0042', tier: 'Pro-Tactical', total: '$149.00', status: 'Settled' },
                         { id: 'INV-0041', tier: 'Pro-Tactical', total: '$149.00', status: 'Settled' },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-[var(--foreground)]/[0.01] transition-colors group">
                           <td className="px-4 sm:px-8 py-3 sm:py-4 font-mono text-[10px] text-[var(--foreground-muted)] font-bold">{row.id}</td>
                           <td className="px-4 sm:px-8 py-3 sm:py-4 text-xs font-black text-[var(--foreground)]">{row.tier}</td>
                           <td className="px-4 sm:px-8 py-3 sm:py-4 text-xs font-black text-[var(--foreground)]">{row.total}</td>
                           <td className="px-4 sm:px-8 py-3 sm:py-4 font-extrabold">
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><Check className="w-3 h-3" /> {row.status}</span>
                           </td>
                           <td className="px-4 sm:px-8 py-3 sm:py-4 text-right">
                              <button className="p-2 text-[var(--foreground-muted)] hover:text-primary transition-colors" onClick={() => alert('Feature coming soon!')}>
                                 <Download className="w-4 h-4" />
                              </button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>

        {/* Sidebar Mini Ad-on */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-gradient-to-br from-[var(--surface)] to-[var(--background-secondary)] border border-[var(--border-main)] group overflow-hidden relative">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                    <Plus className="w-6 h-6 text-primary" />
                 </div>
                 <h3 className="text-xl font-black text-[var(--foreground)] mb-2 tracking-tight">Expand Capability</h3>
                 <p className="text-xs font-bold text-[var(--foreground-muted)] leading-relaxed mb-10">Add professional vector-tracing modules or high-volume detonation clusters to your primary subscription.</p>
                 <div className="space-y-4">
                    {[
                      { name: 'Deep Forensic Expansion', price: '+$49/mo' },
                      { name: 'Priority Engine Support', price: '+$99/mo' },
                    ].map((add, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/5 hover:border-primary/20 transition-all cursor-pointer">
                         <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">{add.name}</span>
                         <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </div>
                    ))}
                 </div>
              </div>
           </Card>

           <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-rose-500/10 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                 </div>
                 <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Notice Hub</h4>
              </div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)] leading-relaxed mb-6 italic">Quota reset scheduled in 12 days. Current detonation velocity is high. Consider tier expansion.</p>
              <Button variant="ghost" className="w-full text-primary hover:text-[var(--foreground)] transition-colors text-[10px] font-black uppercase tracking-[0.2em]" onClick={() => alert('Feature coming soon!')}>Contact Enterprise Concierge</Button>
           </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Layout, 
  Type, 
  Eye, 
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  Square
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../../../components/ui';
import { useTheme } from '../../../context/ThemeContext';

export const AppearancePage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'dark', label: 'Obsidian Night', icon: Moon, color: 'bg-[var(--surface)]', accent: 'bg-primary' },
    { id: 'light', label: 'Clear Quartz', icon: Sun, color: 'bg-slate-50', accent: 'bg-indigo-600' },
    { id: 'system', label: 'System Dynamic', icon: Monitor, color: 'bg-gradient-to-br from-[#0d0e1a] to-slate-200', accent: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Interface Personalization</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Configure visual themes, density, and hardware-inspired styling behaviors.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => alert('Feature coming soon!')}>
            Experimental UI Alpha
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Theme Selection */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-6 md:p-10 border-none bg-[var(--surface)]">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary" />
                 </div>
                 <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-widest">Atmosphere Selection</h3>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                 {themes.map((t) => (
                   <button 
                     key={t.id}
                     onClick={() => setTheme(t.id as any)}
                     className={cn(
                       "relative group flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all outline-none",
                       theme === t.id ? "bg-primary/10 border-primary" : "bg-[var(--background-secondary)]/50 border-[var(--border-color)] hover:border-[var(--border-color)]/30"
                     )}
                   >
                     <div className={cn(
                       "w-full aspect-video rounded-xl overflow-hidden relative shadow-inner",
                       t.color
                     )}>
                        <div className={cn("absolute bottom-2 right-2 w-8 h-8 rounded-lg", t.accent)} />
                        {theme === t.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="p-1.5 bg-white rounded-full text-primary">
                              <Check className="w-4 h-4 stroke-[3px]" />
                            </div>
                          </div>
                        )}
                     </div>
                     <div className="flex items-center gap-2">
                       <t.icon className={cn("w-4 h-4", theme === t.id ? "text-primary" : "text-[var(--foreground-muted)]")} />
                       <span className={cn("text-xs font-black uppercase tracking-widest", theme === t.id ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]")}>{t.label}</span>
                     </div>
                   </button>
                 ))}
              </div>

              <div className="mt-12 pt-10 border-t border-[var(--border-color)] grid md:grid-cols-2 gap-8 md:gap-8 md:p-12">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                       <Layout className="w-4 h-4 text-[var(--foreground-muted)]" /> Layout Density
                    </h4>
                    <div className="space-y-4">
                       {['Comfortable', 'Standard', 'Condensed'].map((density, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--background-secondary)]/50 border border-[var(--border-color)] cursor-pointer hover:border-primary/40 transition-all">
                           <span className="text-xs font-bold text-[var(--foreground-secondary)]">{density}</span>
                           <div className={cn(
                             "w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all",
                             i === 1 ? "bg-primary border-primary" : "border-slate-700"
                           )}>
                             {i === 1 && <Check className="w-3 h-3 text-[var(--foreground)]" />}
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                       <Type className="w-4 h-4 text-[var(--foreground-muted)]" /> Typography Precision
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-xl bg-[var(--background-secondary)]/80 border border-primary/40 flex flex-col gap-2">
                          <span className="text-2xl font-black text-[var(--foreground)]">Aa</span>
                          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Inter Modern</span>
                       </div>
                       <div className="p-4 rounded-xl bg-[var(--background-secondary)]/50 border border-[var(--border-color)] flex flex-col gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                          <span className="text-2xl font-serif text-[var(--foreground)]">Aa</span>
                          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Classic Serif</span>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* Sidebar Mini Settings */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-5 md:p-8 border-none bg-gradient-to-br from-[#161726] to-[#7c3ced]/20 overflow-hidden relative group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <Zap className="w-5 h-5 text-primary fill-primary/20" />
                   <h4 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest">Atmospheric Motion</h4>
                 </div>
                 <p className="text-xs font-bold text-[var(--foreground-secondary)] leading-relaxed mb-8">Enable hardware-accelerated transitions and subtle glass-blur effects for an immersive session.</p>
                 <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-color)] backdrop-blur-md">
                    <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.2em]">60 FPS Animation</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative flex items-center px-1">
                       <div className="absolute right-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                    </div>
                 </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:scale-110 transition-transform">
                 <Eye className="w-32 h-32 text-indigo-500" />
              </div>
           </Card>

           <Card className="p-5 md:p-8 border-none bg-[var(--surface)]">
              <h4 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-6">High Contrast Filter</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border-color)] group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-xs font-bold text-[var(--foreground)] tracking-tight">Deuteranopia Correct</span>
                       <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase">Accessibility V.1</span>
                    </div>
                    <Square className="w-4 h-4 text-slate-800" />
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border-color)] group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-xs font-bold text-[var(--foreground)] tracking-tight">Reduce Motion</span>
                       <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase">Energy Saving Focus</span>
                    </div>
                    <Square className="w-4 h-4 text-slate-800" />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

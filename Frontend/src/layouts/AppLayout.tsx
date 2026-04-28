import React, { useState } from 'react';
import { useLocation, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/PageTransition';
import { PageContainer } from '../components/PageContainer';
import { 
  LayoutDashboard, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  AlertCircle,
  FileText,
  FileSearch,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Activity,
  BarChart3,
  User,
  Lock,
  Palette,
  Code2,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Badge, cn } from '../components/ui';
import { scanService } from '../services/scanService';

import { ThemeToggle } from '../components/ThemeToggle';
import { ChatAssistant } from '../components/ChatAssistant';


export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickScanning, setIsQuickScanning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const sections = [
    {
      title: 'GENERAL',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Scan Center', icon: Search, path: '/scan' },
        { label: 'History', icon: History, path: '/history' },
        { label: 'Live Activity', icon: Activity, path: '/live-activity' },
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Threat Reports', icon: FileText, path: '/reports/threats' },
        { label: 'Threat Intelligence', icon: ShieldAlert, path: '/threat-intel' },
        { label: 'Analytics', icon: BarChart3, path: '/analytics' },
        { label: 'AI Insights', icon: Sparkles, path: '/ai-insights' },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', icon: User, path: '/settings/profile' },
        { label: 'Security', icon: Lock, path: '/settings/security' },
        { label: 'Notifications', icon: Bell, path: '/settings/notifications' },
        { label: 'Appearance', icon: Palette, path: '/settings/appearance' },
        { label: 'API Access', icon: Code2, path: '/settings/api' },
        { label: 'Billing', icon: CreditCard, path: '/settings/billing' },
      ]
    }
  ];

  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-60 shrink-0 bg-[var(--surface)] text-[var(--foreground-secondary)] transform transition-transform duration-300 ease-in-out z-50 lg:relative lg:translate-x-0 border-r border-[var(--border-color)]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="pt-8 pb-6 flex items-center justify-center relative w-full px-6">
            <div className="flex items-center gap-3">
              <img src="/src/assets/images/fraudlenslogo.png" alt="FraudLens Logo" className="w-8 h-8 object-contain logo-bold" />
              <span className="font-bold text-2xl text-[var(--foreground)] tracking-wide">FraudLens</span>
            </div>
            <button className="absolute right-6 top-8 lg:hidden text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-4 py-2 space-y-8">
            {sections.map((section, idx) => (
              <div key={section.title}>
                {idx !== 0 && <div className="h-px bg-[var(--border-color)] mb-8 mx-4" />}
                <p className="px-4 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4">{section.title}</p>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                        isActive 
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
                          : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 transition-colors", "group-hover:text-primary")} />
                      <span className="flex-grow">{item.label}</span>
                      {'hasSub' in item && <ChevronRight className="w-3 h-3 opacity-50" />}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}

            {/* Upgrade Card */}
            <div className="mx-2 mt-8 p-6 rounded-2xl bg-gradient-to-br from-[var(--background-secondary)] to-primary/10 border border-primary/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-20 transition-transform group-hover:scale-110">
                 <Sparkles className="w-8 h-8 text-primary" />
               </div>
               <div className="w-10 h-10 flex items-center justify-center mb-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--foreground)]/10">
                 <img src="/src/assets/images/fraudlenslogo.png" alt="Branding" className="w-8 h-8 object-contain logo-bold" />
               </div>
               <p className="text-xs font-semibold text-[var(--foreground)] mb-2">Additional features to enhance your security.</p>
               <button onClick={() => navigate('/settings/billing')} className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  Upgrade <ArrowUpRight className="w-3 h-3" />
               </button>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)]">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-transparent shrink-0">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-2 text-[var(--foreground-muted)]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
             <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[var(--background-secondary)] flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
               <img src={user?.avatar || `https://picsum.photos/seed/${user?.id}/100/100`} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
             </div>
             <div className="hidden sm:block">
               <h2 className="text-sm font-bold text-[var(--foreground)]">Welcome! {user?.name || 'Guest User'}</h2>
               <p className="text-[10px] font-medium text-[var(--foreground-muted)]">Security is a process.</p>
             </div>
          </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-full px-4 py-2 w-[400px] shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Zap className={cn("w-4 h-4 text-primary", isQuickScanning ? "animate-pulse" : "")} />
            <input 
              type="text" 
              placeholder={isQuickScanning ? "Analyzing..." : "Quick Scan: Enter URL, IP, or Hash"} 
              disabled={isQuickScanning}
              className="bg-transparent border-none outline-none text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] w-full disabled:opacity-50"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && e.currentTarget.value && !isQuickScanning) {
                  const target = e.currentTarget.value;
                  e.currentTarget.value = '';
                  setIsQuickScanning(true);
                  try {
                    const { scanId } = await scanService.submitScan(target, 'url');
                    navigate(`/results/${scanId}`);
                  } catch (error) {
                    console.error("Quick scan failed", error);
                  } finally {
                    setIsQuickScanning(false);
                  }
                }
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setChatOpen(true)} className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/settings/notifications')} className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-grow overflow-x-hidden overflow-y-auto bg-[var(--background)]">
          <PageContainer>
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </PageContainer>
        </main>
      </div>

      {/* Slide-over Chat Interface */}
      <ChatAssistant chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
};

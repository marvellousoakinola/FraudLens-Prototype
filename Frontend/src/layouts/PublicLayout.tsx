import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { PageTransition } from '../components/PageTransition';
import { ChevronRight, MessageSquare, Menu, X } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { ThemeToggle } from '../components/ThemeToggle';
import { ChatAssistant } from '../components/ChatAssistant';


export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <header className="bg-[var(--background)] sticky top-0 z-50 border-b border-[var(--border-main)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/src/assets/images/fraudlenslogo.png" alt="Logo" className="w-8 h-8 object-contain logo-bold" />
            <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">FraudLens</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-3 border-r border-[var(--border-main)] pr-8">
              <ThemeToggle />
              <button onClick={() => setChatOpen(true)} className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            <Link to="/login" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-primary transition-colors">Sign in</Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setChatOpen(true)} className="w-8 h-8 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-primary transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Content */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[var(--border-main)] bg-[var(--background)] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3 flex flex-col">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                   <Button variant="outline" className="w-full justify-center">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                   <Button className="w-full justify-center">Sign Up</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <ChatAssistant chatOpen={chatOpen} setChatOpen={setChatOpen} />
      <footer className="bg-[var(--background)] border-t border-[var(--border-color)] pt-20 pb-12 relative overflow-hidden">
        {/* Subtle background glow for footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            <div className="col-span-2 md:col-span-4 lg:col-span-6">
              <div className="flex items-center gap-2 mb-6">
                <img src="/src/assets/images/fraudlenslogo.png" alt="FraudLens" className="w-8 h-8 object-contain logo-bold" />
                <span className="font-bold text-2xl tracking-tight text-[var(--foreground)]">FraudLens</span>
              </div>
              <p className="text-sm text-[var(--foreground-muted)] max-w-sm mb-8 leading-relaxed">
                Detect fraud before it detects you. Industry-leading AI intelligence for real-time threat detection, URL scanning, and automated digital risk analysis.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-primary hover:border-primary/50 transition-all">
                  <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-primary hover:border-primary/50 transition-all">
                  <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.023 4.023 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-primary hover:border-primary/50 transition-all">
                  <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <h4 className="font-bold text-[var(--foreground)] mb-6 tracking-wide">Products</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/scan" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">URL Radar</Link></li>
                <li><Link to="/scan" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">File Analyzer</Link></li>
                <li><Link to="/threat-intel" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Domain Intel</Link></li>
                <li><Link to="/settings/api" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Threat Feed API</Link></li>
                <li><Link to="/scan" className="text-[var(--foreground-muted)] hover:text-primary transition-colors flex items-center gap-2">Browser Extension <Badge variant="info" className="text-[8px] py-0 border-none bg-primary/20 text-primary">BETA</Badge></Link></li>
              </ul>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <h4 className="font-bold text-[var(--foreground)] mb-6 tracking-wide">Solutions</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/login" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Enterprise Security</Link></li>
                <li><Link to="/login" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Trust & Safety</Link></li>
                <li><Link to="/reports/threats" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Threat Hunting</Link></li>
                <li><Link to="/analytics" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Financial Fraud</Link></li>
                <li><Link to="/threat-intel" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Brand Protection</Link></li>
              </ul>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <h4 className="font-bold text-[var(--foreground)] mb-6 tracking-wide">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/settings/documentation" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/settings/api" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link to="/reports/threats" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Global Threat Reports</Link></li>
                <li><Link to="/history" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Case Studies</Link></li>
                <li><Link to="/ai-insights" className="text-[var(--foreground-muted)] hover:text-primary transition-colors">Security Blog</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-[var(--border-main)] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium text-[var(--foreground-muted)]">
              &copy; 2026 FraudLens Intelligence. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[var(--foreground-muted)]">
              <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Cookie Policy</Link>
              <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Vulnerability Disclosure</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Globe, FileText, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button, Card, Input, Badge } from '../../components/ui';
import { scanService } from '../../services/scanService';



export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setScanning(true);
    try {
      const type = target.includes('.') ? 'url' : 'file'; // Simple heuristic
      const { scanId } = await scanService.submitScan(target, type);
      navigate(`/results/${scanId}`);
    } catch (error) {
      console.error(error);
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-[var(--background)]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/herobackground.jpg" 
            alt="Security Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/90 dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0A0F1F]/90 dark:to-primary/90 transition-colors duration-300" />
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg mb-8">
            <Badge variant="info" className="bg-primary/20 text-primary border-none shadow-[var(--soft-glow)]">New: v2.4 Engine</Badge>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider shadow-black/50">AI Link Analysis Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto drop-shadow-2xl">
            Detect fraud before it <span className="text-primary italic dark:not-italic dark:shadow-[var(--soft-glow)]">detects you.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md">
            Scan URLs, files, and domains for malicious intent with the industry's most accurate intelligence engine.
          </p>

          <div className="p-1.5 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 max-w-3xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/20">
           <Card className="p-2 md:p-3 bg-black/40 dark:bg-[var(--background-secondary)]/50 backdrop-blur-2xl border border-white/10 shadow-inner focus-within:bg-black/60 dark:focus-within:bg-[var(--surface)]/80 transition-all duration-300">
             <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
               <div className="relative flex-grow">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                 <input 
                   type="text" 
                   placeholder="Paste a URL or domain to analyze..." 
                   className="w-full h-12 sm:h-14 pl-12 pr-4 bg-white/5 rounded-xl border border-white/10 outline-none text-white placeholder:text-white/50 font-medium transition-all focus:border-primary/50 focus:bg-white/10 shadow-inner"
                   value={target}
                   onChange={(e) => setTarget(e.target.value)}
                 />
               </div>
               <Button size="lg" className="h-12 sm:h-14 w-full sm:w-auto px-10 rounded-xl shadow-[var(--soft-glow)]" loading={scanning}>
                 Analyze Link
               </Button>
             </form>
           </Card>
          </div>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 opacity-90 mx-auto max-w-4xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-4 py-2 sm:py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg w-full sm:w-auto justify-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> Real-time threat detection
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-4 py-2 sm:py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg w-full sm:w-auto justify-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> AI-powered reputation engine
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-4 py-2 sm:py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg w-full sm:w-auto justify-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> Zero-day link analysis
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
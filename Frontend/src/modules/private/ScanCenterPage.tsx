import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Upload, 
  Globe, 
  Activity, 
  FileSearch, 
  Zap, 
  AlertTriangle,
  Server,
  Terminal,
  ChevronRight,
  MoreHorizontal,
  Info,
  Download,
  Loader2
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../../components/ui';
import { motion, AnimatePresence } from 'motion/react';
import { scanService } from '../../services/scanService';

type ScanType = 'url' | 'file' | 'intelligence';

export const ScanCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ScanType>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  // Scan options state
  const [scanOptions, setScanOptions] = useState([
    { id: 'sandbox', label: 'Sandbox Isolation', desc: 'Secure detonation for active components', active: true },
    { id: 'ocr', label: 'OCR Extraction', desc: 'Read text from analyzed screenshots', active: false },
    { id: 'heuristic', label: 'Heuristic Engine', desc: 'Behavioral-based pattern matching', active: true },
    { id: 'geo', label: 'Geo-Relay', desc: 'Analyze from multiple locations', active: false },
  ]);

  const toggleOption = (id: string) => {
    setScanOptions(opts => opts.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const startScan = async (fileTargetName?: string) => {
    if (!inputValue.trim() && activeTab === 'url' && !fileTargetName) return;
    
    setIsScanning(true);
    try {
      const target = fileTargetName || inputValue || 'manually_uploaded_file';
      const { scanId } = await scanService.submitScan(
        target, 
        activeTab === 'url' ? 'url' : 'file'
      );
      navigate(`/results/${scanId}`);
    } catch (error) {
      console.error('Scan initiation failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setInputValue(file.name);
      startScan(file.name);
    } else {
      setInputValue('local_file_upload');
      startScan('local_file_upload');
    }
  }, []);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setInputValue(file.name);
      startScan(file.name);
    }
  };

  const exportToCSV = () => {
    const data = [
      ['Scan ID', 'Timestamp', 'Target', 'Status', 'Risk Index', 'Summary'],
      [
        'sc_' + Math.random().toString(36).substr(2, 9),
        new Date().toLocaleString(),
        'https://security-update-verification.io/auth-verify-session',
        'Malicious',
        '88',
        'Heuristic analysis detected a high-probability credential harvesting form coupled with a secondary payload.'
      ]
    ];
    
    const csvContent = data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fraudlens_scan_report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const tabs: { id: ScanType; label: string; icon: any }[] = [
    { id: 'url', label: 'URL / Domain', icon: Globe },
    { id: 'file', label: 'File Analysis', icon: FileSearch },
    { id: 'intelligence', label: 'Threat Intel', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Scan Center</h1>
            <Badge variant="info">v2.4 Engine</Badge>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Deep packet inspection and heuristic behavioral analysis.</p>
        </div>
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="bg-[var(--background-secondary)] border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest gap-2 h-10 px-4 group hover:border-primary/30 transition-all shadow-lg shadow-black/20"
          >
            <Download className="w-3.5 h-3.5 text-[var(--foreground-muted)] group-hover:text-primary transition-colors" />
            <span className="text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] transition-colors">Export CSV</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-[var(--background-secondary)] overflow-hidden">
                <div className="w-full h-full bg-[var(--surface)] animate-pulse" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Active Engines: 4</p>
        </div>
      </div>
    </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        {/* Main Scan Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-1 border-none bg-[var(--surface)] overflow-hidden">
            <div className="flex border-b border-[var(--border-color)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === tab.id ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-[var(--foreground-muted)]")} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'url' && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Analysis Target</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Search className="w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-primary transition-colors" />
                        </div>
                        <input 
                          type="text"
                          placeholder="https://example.com/login or 192.168.1.1"
                          className="w-full h-16 pl-12 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-[var(--foreground-muted)]/50"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase">Analysis Speed</p>
                          <p className="text-xs font-bold text-[var(--foreground)]">Hyper (Sub-second)</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border-color)] flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Server className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase">Engine Relay</p>
                          <p className="text-xs font-bold text-[var(--foreground)]">FraudLens Intelligence</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      onClick={() => startScan()}
                      disabled={isScanning || !inputValue.trim()}
                      className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                    >
                      {isScanning ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Initiating Scan...
                        </span>
                      ) : (
                        'Initiate Security Scan'
                      )}
                    </Button>
                  </motion.div>
                )}

                {activeTab === 'file' && (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="space-y-6"
                  >
                    <div 
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={handleFileClick}
                      className={cn(
                        "h-64 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                        isDragging 
                          ? "border-4 border-primary bg-primary/5 scale-[1.02]" 
                          : "border-2 border-[var(--border-color)] bg-[var(--background-secondary)] hover:border-primary/20 hover:bg-[var(--surface)] hover:scale-[1.01]"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-full transition-all duration-500",
                        isDragging ? "bg-primary text-[var(--foreground)] scale-110 shadow-lg shadow-primary/40 animate-pulse-soft" : "bg-[var(--surface)] text-[var(--foreground-muted)] group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        {isScanning ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-[var(--foreground)] mb-1">Click or drag file to analyze</p>
                        <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Supports PDF, DOCX, EXE, ZIP (Max 128MB)</p>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] font-medium text-amber-500/80 leading-normal">
                        Files are uploaded to a secure, ephemeral sandbox. They are automatically deleted after analysis unless persistent storage is enabled in settings.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'intelligence' && (
                  <motion.div
                    key="intel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-5 border-none bg-[var(--background-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer group" onClick={() => navigate('/threat-intel')}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Terminal className="w-5 h-5 text-indigo-500" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-all transform group-hover:translate-x-1" />
                        </div>
                        <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">Threat Actor Feed</h4>
                        <p className="text-[10px] font-medium text-[var(--foreground-muted)] uppercase tracking-tighter">Live honeypot and actor telecom proxy data</p>
                      </Card>
                      <Card className="p-5 border-none bg-[var(--background-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer group" onClick={() => navigate('/reports')}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-rose-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-rose-500" />
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-all transform group-hover:translate-x-1" />
                        </div>
                        <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">CVE Engine / Reports</h4>
                        <p className="text-[10px] font-medium text-[var(--foreground-muted)] uppercase tracking-tighter">Query vulnerabilities by vendor or keyword</p>
                      </Card>
                    </div>

                    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--background-secondary)]/30 overflow-hidden">
                      <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--background-secondary)]/50 flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Global Feed (Live)</h4>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Synchronized</span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="py-8 text-center">
                          <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest whitespace-nowrap">Awaiting connection to global feed...</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Recent Scan Summary */}
          {activeTab !== 'intelligence' && lastScanResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 ml-1">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Heuristic Summary Output</h3>
              </div>
              
              <Card className="p-5 md:p-8 border-none bg-[var(--surface)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-5 md:p-8 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                  <Shield className="w-32 h-32 text-rose-500" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 md:p-8">
                  <div className="space-y-4 flex-grow">
                     <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs font-mono font-black text-[var(--foreground)]/90 break-all bg-[var(--background-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                          https://security-update-verification.io/auth-verify-session
                        </p>
                        <Badge variant="danger" className="text-[9px] h-6 px-3 shadow-lg shadow-rose-500/20">Critical: Malicious</Badge>
                     </div>
                     <p className="text-sm font-medium text-[var(--foreground-muted)] leading-relaxed max-w-2xl border-l border-rose-500/30 pl-4 py-1">
                        Heuristic analysis detected a high-probability <span className="text-[var(--foreground)] font-bold">credential harvesting</span> form coupled with a secondary payload attempting to redirect traffic to an untrusted registrar within a high-risk jurisdiction.
                     </p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center gap-6 shrink-0 md:pl-10 md:border-l border-[var(--border-color)]">
                     <div className="flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20 flex items-center justify-center mb-1">
                           <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(244,63,94,0.1)]" viewBox="0 0 64 64">
                              <circle 
                                 cx="32" 
                                 cy="32" 
                                 r="28" 
                                 stroke="currentColor" 
                                 strokeWidth="3" 
                                 fill="none" 
                                 className="text-[var(--background-secondary)]/80"
                              />
                              <circle 
                                 cx="32" 
                                 cy="32" 
                                 r="28" 
                                 stroke="currentColor" 
                                 strokeWidth="4" 
                                 fill="none" 
                                 strokeDasharray="176" 
                                 strokeDashoffset="21" 
                                 strokeLinecap="round" 
                                 className="text-rose-500 transition-all duration-1000 ease-out"
                              />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-black text-[var(--foreground)] leading-none">88</span>
                              <span className="text-[7px] font-black text-rose-500 uppercase tracking-tighter">High</span>
                           </div>
                        </div>
                        <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Risk Intensity</p>
                     </div>
                     <button className="p-3 bg-[var(--background-secondary)] rounded-xl border border-[var(--border-color)] hover:bg-primary/20 hover:border-primary/40 transition-all group/btn" onClick={() => alert('Feature coming soon!')}>
                        <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover/btn:text-[var(--foreground)] transition-colors" />
                     </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar Info/Options */}
        <div className="space-y-6">
          <Card className="p-6 border-none bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] tracking-widest uppercase">Scan Options</h3>
              <Info className="w-4 h-4 text-[var(--foreground-muted)]" />
            </div>
            
            <div className="space-y-4">
              {scanOptions.map((opt, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="max-w-[70%]">
                    <p className="text-xs font-bold text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] transition-colors capitalize">{opt.label}</p>
                    <p className="text-[9px] font-medium text-[var(--foreground-muted)]">{opt.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleOption(opt.id)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      opt.active ? "bg-primary" : "bg-[var(--border-color)]"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                      opt.active ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-none bg-gradient-to-br from-[var(--background-secondary)] to-[#2563EB11] overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">API Integration</h3>
              <p className="text-xs font-medium text-[var(--foreground-muted)] mb-4">Leverage our scanning engines directly in your CI/CD pipeline or custom applications.</p>
              <Button size="sm" variant="outline" className="text-[10px] font-bold bg-[var(--surface)]/50 border-[var(--border-color)] group-hover:bg-primary group-hover:border-primary transition-all" onClick={() => navigate('/settings/documentation')}>
                Access Documentation
              </Button>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
               <Shield className="w-32 h-32 text-primary" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

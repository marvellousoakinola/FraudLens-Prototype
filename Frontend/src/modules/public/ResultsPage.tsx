import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  ExternalLink, 
  Clock, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Download,
  Terminal,
  Server,
  Activity,
  Zap,
  MoreVertical,
  Fingerprint,
  Archive,
  Globe,
  MapPin
} from 'lucide-react';
import { scanService } from '../../services/scanService';
import { ScanResult } from '../../types';
import { Card, Badge, Button, cn, Skeleton } from '../../components/ui';
import { motion, AnimatePresence } from 'motion/react';

export const ResultsPage: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [geoData, setGeoData] = useState<{ ip: string; lat: string; lon: string; city: string; country: string } | null>(null);

  const steps = [
    "Establishing secure connection to sandbox...",
    "Executing link reputation lookup...",
    "Heuristic engine analysis in progress...",
    "Finalizing security intelligence report..."
  ];

  useEffect(() => {
    if (scanId) {
      const timer = setInterval(() => {
        setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000);

      // Fetch the actual result after the UI simulation time to allow the mock backend to resolve
      const timeoutId = setTimeout(async () => {
        try {
          const res = await scanService.getScanResult(scanId);
          setResult(res);

          // Find IP address and get geolocation
          const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
          let detectedIp = res.target.match(ipRegex)?.[0];
          
          if (!detectedIp) {
            for (const finding of res.findings) {
              const match = finding.description.match(ipRegex) || finding.title.match(ipRegex);
              if (match) {
                detectedIp = match[0];
                break;
              }
            }
          }

          if (detectedIp) {
            fetch(`https://get.geojs.io/v1/ip/geo/${detectedIp}.json`)
              .then(resp => resp.json())
              .then(data => {
                if (data.latitude && data.longitude) {
                  setGeoData({
                    ip: detectedIp,
                    lat: data.latitude,
                    lon: data.longitude,
                    city: data.city || 'Unknown City',
                    country: data.country || 'Unknown Country'
                  });
                }
              })
              .catch(err => console.error("Geolocation fetch failed", err));
          }
        } catch (error) {
          console.error('Failed to fetch scan results', error);
        } finally {
          setLoading(false);
          clearInterval(timer);
        }
      }, 3500);

      return () => {
        clearInterval(timer);
        clearTimeout(timeoutId);
      };
    }
  }, [scanId]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-primary/5" />
          <motion.div 
            className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 bg-primary/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={loadingStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-xl font-black text-[var(--foreground)] uppercase tracking-widest"
            >
              {steps[loadingStep]}
            </motion.h2>
          </AnimatePresence>
          <div className="w-64 h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden mx-auto">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
          <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Quantum Analysis Engine v2.4</p>
        </div>
      </div>
    );
  }

  if (!result) return <div className="p-8 text-[var(--foreground)] font-bold">Analysis target not found in ledger.</div>;

  const getStatusConfig = (status: ScanResult['status']) => {
    switch (status) {
      case 'malicious': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: ShieldAlert, label: 'Malicious' };
      case 'suspicious': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Info, label: 'Suspicious' };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: ShieldCheck, label: 'Clean' };
    }
  };

  const status = getStatusConfig(result.status);

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-[10px] font-black text-[var(--foreground-muted)] hover:text-primary uppercase tracking-[0.2em] transition-colors mb-4 group">
            <ChevronLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Returns to Control
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Analysis Report</h1>
            <div className={cn("px-3 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest", status.bg, status.color, status.border)}>
              {result.type} DETECTED
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> ID: <span className="text-[var(--foreground-secondary)] font-mono">{result.id.slice(0, 12)}</span></span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2">
            <Download className="w-4 h-4" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2">
            <Share2 className="w-4 h-4" /> Share Link
          </Button>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
            <Archive className="w-4 h-4" /> Quarentine
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Risk Gauge Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-10 border-none bg-[var(--surface)] text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20" />
            <div className={cn("inline-flex items-center gap-2 px-4 py-1 rounded-full mb-8 border", status.bg, status.color, status.border)}>
              <status.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{status.label} Status</span>
            </div>
            
            <div className="relative w-full aspect-square max-w-[220px] mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(244,63,94,0.1)]" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="86" stroke="var(--background-secondary)" strokeWidth="10" fill="none" />
                <circle 
                  cx="100" cy="100" r="86" 
                  stroke={result.riskScore > 75 ? '#f43f5e' : result.riskScore > 30 ? '#f59e0b' : '#10b981'} 
                  strokeWidth="12" fill="none" 
                  strokeDasharray="540" 
                  strokeDashoffset={540 - (result.riskScore / 100 * 540)} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <h2 className="text-5xl font-black text-[var(--foreground)] leading-none">{result.riskScore}</h2>
                <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mt-2">Risk Index</p>
                <div className={cn(
                  "mt-4 px-3 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                  result.riskScore > 75 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : result.riskScore > 30 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  {result.riskScore > 75 ? 'Critical' : result.riskScore > 30 ? 'Suspicious' : 'Minimal'}
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left border-t border-[var(--border-color)] pt-8">
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--background-secondary)] rounded-xl">
                    <Globe className="w-4 h-4 text-[var(--foreground-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">Target Resource</p>
                    <p className="text-[10px] font-bold text-[var(--foreground)] break-all leading-tight">{result.target}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[var(--background-secondary)] rounded-xl">
                    <Server className="w-4 h-4 text-[var(--foreground-muted)]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">Engine Relay</p>
                    <p className="text-xs font-bold text-[var(--foreground-secondary)]">FraudLens High-Precision API</p>
                  </div>
               </div>
            </div>
          </Card>

          <Card className="p-8 border-none bg-[var(--surface)] relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
               <ShieldAlert className="w-24 h-24 text-[var(--foreground)]" />
             </div>
             <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest mb-4 flex items-center gap-2">
               <Fingerprint className="w-4 h-4 text-primary" /> Intelligence Summary
             </h3>
             <p className="text-xs font-semibold text-[var(--foreground-muted)] leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
               "{result.summary}"
             </p>
          </Card>

          {geoData && (
            <Card className="p-1 border-none bg-[var(--surface)] overflow-hidden">
               <div className="px-7 py-5 flex items-center justify-between border-b border-[var(--border-color)]">
                 <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-primary" /> Origin Geolocation
                 </h3>
                 <Badge variant="info" className="text-[8px] bg-primary/10 text-primary border-none">{geoData.ip}</Badge>
               </div>
               <div className="p-2">
                 <div className="w-full h-[200px] rounded-2xl overflow-hidden bg-[var(--background-secondary)] relative">
                    <iframe 
                      title="IP Location Map"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(geoData.lon)-1},${parseFloat(geoData.lat)-1},${parseFloat(geoData.lon)+1},${parseFloat(geoData.lat)+1}&layer=mapnik&marker=${geoData.lat},${geoData.lon}`} 
                    />
                 </div>
                 <div className="px-5 py-4 flex flex-col items-center text-center">
                    <p className="text-sm font-bold text-[var(--foreground)] mb-1">{geoData.city}, {geoData.country}</p>
                    <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">
                       LAT: {parseFloat(geoData.lat).toFixed(4)} &middot; LON: {parseFloat(geoData.lon).toFixed(4)}
                    </p>
                 </div>
               </div>
            </Card>
          )}
        </div>

        {/* Detailed Findings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-[var(--surface)] overflow-hidden">
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-md font-black text-[var(--foreground)] uppercase tracking-tight">Tactical Findings</h2>
              <Badge variant={result.findings.length > 0 ? 'danger' : 'success'}>
                {result.findings.length} Anomalies
              </Badge>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              <AnimatePresence>
                {result.findings.length > 0 ? (
                  result.findings.map((finding, idx) => (
                    <motion.div 
                      key={`${finding.id}-${idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 flex gap-6 hover:bg-[var(--foreground)]/5 transition-colors group"
                    >
                      <div className={cn(
                        "shrink-0 w-1.5 h-12 rounded-full",
                        finding.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 
                        finding.severity === 'high' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-blue-500'
                      )} />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-black text-[var(--foreground)] tracking-tight group-hover:text-primary transition-colors">{finding.title}</h4>
                          <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border",
                            finding.severity === 'critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            finding.severity === 'high' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}>
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[var(--foreground-muted)] leading-relaxed max-w-2xl">{finding.description}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-[var(--foreground-muted)]">Target matches baseline behavioral patterns. No threats identified.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Heuristic Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Domain Age', val: '4.2 Days', icon: Clock, risk: 'high' },
              { label: 'Security Headers', val: 'Missing', icon: ShieldAlert, risk: 'medium' },
              { label: 'SSL Status', val: 'Valid (DV)', icon: Server, risk: 'low' },
              { label: 'Interaction', val: 'Passive', icon: Activity, risk: 'low' },
            ].map((item, i) => (
              <Card key={i} className="p-6 border-none bg-[var(--surface)] group hover:border-[var(--border-color)] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[var(--background-secondary)] rounded-xl group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-primary" />
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    item.risk === 'high' ? "bg-rose-500" : item.risk === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                </div>
                <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-xs font-black text-[var(--foreground)] tracking-widest">{item.val}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

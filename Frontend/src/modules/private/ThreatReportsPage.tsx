import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  ChevronDown, 
  ShieldAlert, 
  Calendar,
  Layers,
  BarChart3,
  MoreVertical,
  ExternalLink,
  PieChart as PieChartIcon,
  X,
  Check
} from 'lucide-react';
import { Card, Badge, Button, Input, cn, Skeleton } from '../../components/ui';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { reportService, ReportItem, RecentReport } from '../../services/reportService';

const reportData = [
  { name: 'Mon', threats: 0, safe: 0 },
  { name: 'Tue', threats: 0, safe: 0 },
  { name: 'Wed', threats: 0, safe: 0 },
  { name: 'Thu', threats: 0, safe: 0 },
  { name: 'Fri', threats: 0, safe: 0 },
  { name: 'Sat', threats: 0, safe: 0 },
  { name: 'Sun', threats: 0, safe: 0 },
];

export const ThreatReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('all'); // all, high, medium, low
  const [dateRange, setDateRange] = useState('all'); // all, 7, 30, 90

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customReportDate, setCustomReportDate] = useState('7days');
  const [customReportConfidence, setCustomReportConfidence] = useState('high');
  const [customReportThreatTypes, setCustomReportThreatTypes] = useState<string[]>(['Malware']);
  const [customReportTarget, setCustomReportTarget] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Mock the generation process
    setTimeout(() => {
      setIsGenerating(false);
      setIsModalOpen(false);
      // Mock triggering download
      alert("Custom Report generated and downloaded successfully!");
    }, 2000);
  };

  const toggleThreatType = (type: string) => {
    setCustomReportThreatTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [reportsRes, recentRes] = await Promise.all([
          reportService.getReports(),
          reportService.getRecentReports()
        ]);
        setReports(reportsRes);
        setRecentReports(recentRes);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter implementation
  const filteredReports = reports.filter(report => {
    // Search Term Filter
    const matchesSearch = report.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Confidence Filter
    let matchesConfidence = true;
    if (confidenceFilter !== 'all') {
      const confidenceValue = parseInt(report.confidence);
      if (confidenceFilter === 'high') matchesConfidence = confidenceValue > 80;
      if (confidenceFilter === 'medium') matchesConfidence = confidenceValue > 40 && confidenceValue <= 80;
      if (confidenceFilter === 'low') matchesConfidence = confidenceValue <= 40;
    }

    return matchesSearch && matchesConfidence;
  });

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Threat Intelligence Reports</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Executive high-level summaries and detailed forensic investigations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
            Generate New Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 md:p-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-3">
          <Card className="p-5 md:p-8 border-none bg-[var(--surface)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
               <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                 <div className="p-2 bg-rose-500/10 rounded-lg shrink-0">
                   <BarChart3 className="w-4 h-4 text-rose-500" />
                 </div>
                 <h3 className="text-xs sm:text-sm font-black text-[var(--foreground)] uppercase tracking-widest truncate">Threat Vector Velocity</h3>
               </div>
               <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Active Threats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--background-secondary)]" />
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Baseline</span>
                  </div>
               </div>
             </div>
             
             <div className="h-[250px] sm:h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={reportData}>
                   <defs>
                     <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                       <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                   <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                     dy={10}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: 700 }}
                   />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#020308', border: '1px solid #f43f5e44', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#f43f5e', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="threats" 
                     stroke="#f43f5e" 
                     strokeWidth={3}
                     fill="url(#roseGradient)"
                     activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </Card>
        </div>

        {/* Sidebar Mini Components */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-none bg-[var(--surface)]">
             <h4 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-6">Recent Reports</h4>
             <div className="space-y-4">
                {loading ? (
                   <div className="py-12 text-center">
                     <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic animate-pulse">Accessing archives...</p>
                   </div>
                ) : recentReports.length === 0 ? (
                   <div className="py-12 text-center">
                     <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic">Inventory empty</p>
                   </div>
                ) : (
                   recentReports.map((rep, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-[var(--foreground)]/5 p-2 rounded-xl transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <FileText className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] transition-colors">{rep.title}</p>
                            <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter">{rep.date} • {rep.size}</p>
                          </div>
                       </div>
                       <Download className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]" />
                    </div>
                  ))
                )}
             </div>
             <Button variant="outline" className="w-full mt-6 bg-transparent border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest h-10" onClick={() => alert('Feature coming soon!')}>
                Browse Archive
             </Button>
          </Card>

          <Card className="p-6 border-none bg-gradient-to-br from-[var(--background-secondary)] to-rose-500/10">
             <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h4 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Security Health</h4>
             </div>
             <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_12px_rgba(244,63,94,0.1)]" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" stroke="var(--border-color)" strokeWidth="6" fill="none" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    stroke="#f43f5e" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="339" 
                    strokeDashoffset="75" 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                   <h3 className="text-3xl font-black text-[var(--foreground)] leading-none">78%</h3>
                   <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest mt-1">Ingress</span>
                </div>
             </div>
             <p className="text-[10px] font-bold text-[var(--foreground-muted)] text-center uppercase tracking-widest px-4 leading-relaxed">System is showing higher than normal ingress friction.</p>
          </Card>
        </div>

        {/* Investigative Feed */}
        <div className="lg:col-span-4 mt-8">
           <Card className="border-none bg-[var(--surface)] overflow-hidden">
             <div className="px-4 md:px-8 py-4 border-b border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-primary" />
                    <h3 className="text-md font-black text-[var(--foreground)] uppercase tracking-tight">Investigative Ledger</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                     <div className="relative flex-grow sm:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                       <input 
                         type="text" 
                         placeholder="Search report ID or target..." 
                         className="w-full h-9 pl-9 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary transition-all overflow-hidden"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                     </div>
                     <div className="flex gap-2">
                       <div className="relative w-full sm:w-36">
                         <select 
                           className="w-full h-9 pl-3 pr-8 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                           value={confidenceFilter}
                           onChange={(e) => setConfidenceFilter(e.target.value)}
                         >
                           <option value="all">All Confidence</option>
                           <option value="high">High (&gt;80%)</option>
                           <option value="medium">Medium (41-80%)</option>
                           <option value="low">Low (1-40%)</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--foreground-muted)] pointer-events-none" />
                       </div>
                       <Button variant="outline" size="sm" className="h-9 px-3 bg-[var(--background-secondary)] border-[var(--border-color)] text-xs font-black gap-2" onClick={() => setShowFilters(!showFilters)}>
                         <Filter className="w-3.5 h-3.5" />
                       </Button>
                     </div>
                  </div>
                </div>
             </div>
             <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">ID Reference</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Analysis Target</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Confidence Level</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Forensic Link</th>
                      <th className="px-4 sm:px-8 py-3 sm:py-4 text-[9px] font-black text-[var(--foreground-muted)] uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic animate-pulse">Synchronizing investigative data...</p>
                        </td>
                      </tr>
                    ) : filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest italic">No filtered investigative data found...</p>
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((row, i) => (
                        <tr key={i} className="hover:bg-[var(--foreground)]/5 transition-colors group">
                          <td className="px-4 sm:px-8 py-3 sm:py-4 font-mono text-[10px] text-[var(--foreground-muted)]">{row.id}</td>
                          <td className="px-4 sm:px-8 py-3 sm:py-4 text-[11px] font-bold text-[var(--foreground)]">{row.target}</td>
                          <td className="px-4 sm:px-8 py-3 sm:py-4">
                            <div className="flex flex-col gap-1.5 w-max sm:w-32">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest italic">{row.confidence} confidence</span>
                              </div>
                              <div className="h-1 bg-[var(--background-secondary)] rounded-full overflow-hidden w-full">
                                <div className="h-full bg-primary" style={{ width: row.confidence }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-8 py-3 sm:py-4">
                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest gap-2 bg-[var(--background-secondary)]/30 border border-[var(--border-color)]/50" onClick={() => alert('Feature coming soon!')}>
                              <ExternalLink className="w-3 h-3" /> View Source
                            </Button>
                          </td>
                          <td className="px-4 sm:px-8 py-3 sm:py-4 text-right">
                            <button className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors" onClick={() => alert('Feature coming soon!')}>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
             <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface)] text-center">
                <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-[0.2em] italic">Report ledger synchronized with Global Intel v2.4-stable</p>
             </div>
           </Card>
        </div>
      </div>

      {/* Generate Custom Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-[var(--surface)] border-[var(--border-color)] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--background-secondary)]/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Generate Custom Report</h3>
                  <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mt-1.5">Configure report parameters</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors group"
                type="button"
              >
                <X className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateReport} className="p-5 md:p-8 space-y-8">
              {/* Target / Search Query */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-widest pl-1">Target Resources / Keywords (Optional)</label>
                <Input 
                  placeholder="e.g., domain.com, internal-network, malware signature" 
                  value={customReportTarget}
                  onChange={e => setCustomReportTarget(e.target.value)}
                  className="bg-[var(--background)] border-[var(--border-color)] h-12"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5 pt-4 md:p-8 text-left">
                {/* Time Range */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-widest pl-1">Time Horizon</label>
                  <div className="space-y-2">
                    {[
                      { id: '24hr', label: 'Last 24 Hours' },
                      { id: '7days', label: 'Last 7 Days' },
                      { id: '30days', label: 'Last 30 Days' },
                      { id: 'all', label: 'All-Time (Historical)' }
                    ].map(period => (
                      <button
                        key={period.id}
                        type="button"
                        onClick={() => setCustomReportDate(period.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-bold",
                          customReportDate === period.id 
                            ? "bg-primary/5 border-primary text-primary shadow-[0_0_10px_rgba(124,58,237,0.1)]" 
                            : "bg-[var(--background-secondary)] border-[var(--border-color)] text-[var(--foreground-secondary)] hover:border-primary/50"
                        )}
                      >
                        {period.label}
                        {customReportDate === period.id && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Threat Classes & Confidence */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-widest pl-1">Minimum Confidence Limit</label>
                    <select 
                      value={customReportConfidence}
                      onChange={e => setCustomReportConfidence(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--background-secondary)] text-[var(--foreground)] text-sm font-bold outline-none focus:border-primary"
                    >
                      <option value="all">Any Confidence Score</option>
                      <option value="low">Low+ (Score 0-100)</option>
                      <option value="medium">Medium+ (Score 40-100)</option>
                      <option value="high">High & Critical Only (Score 80-100)</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-widest pl-1">Specific Threat Signatures</label>
                    <div className="flex flex-wrap gap-2">
                      {['Malware', 'Phishing', 'Spam', 'Botnet', 'Ransomware'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleThreatType(type)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                            customReportThreatTypes.includes(type)
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-[var(--background-secondary)] border-[var(--border-color)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[var(--border-main)] flex flex-col sm:flex-row items-center justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" loading={isGenerating} size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
                  <span className="flex items-center gap-2 text-sm">
                    <Download className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Export Report'}
                  </span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

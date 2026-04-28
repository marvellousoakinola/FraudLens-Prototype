import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldAlert, 
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Download,
  Calendar,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { Card, Badge, Button, Input, cn, Skeleton } from '../../components/ui';
import { historyService } from '../../services/scanService';
import { ScanResult } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, malicious, suspicious, clean
  const [dateRange, setDateRange] = useState('30'); // all, 7, 30, 90
  const [riskRange, setRiskRange] = useState('all'); // all, low, medium, critical
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, risk-desc, risk-asc

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await historyService.getHistory();
      setHistory(res);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click from firing
    try {
      setDeletingId(id);
      await historyService.deleteScan(id);
      setHistory(prev => prev.filter(scan => scan.id !== id));
    } catch (error) {
      console.error("Failed to delete scan", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHistory = history.filter(scan => {
    // Search Term Filter
    const matchesSearch = scan.target.toLowerCase().includes(searchTerm.toLowerCase()) || scan.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status Filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = scan.status === statusFilter;
    }

    // Risk Filter
    let matchesRisk = true;
    if (riskRange === 'low') matchesRisk = scan.riskScore <= 30;
    if (riskRange === 'medium') matchesRisk = scan.riskScore > 30 && scan.riskScore <= 75;
    if (riskRange === 'critical') matchesRisk = scan.riskScore > 75;

    // Date Filter
    let matchesDate = true;
    if (dateRange !== 'all') {
      const scanDate = new Date(scan.timestamp);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
      matchesDate = scanDate >= daysAgo;
    }

    return matchesSearch && matchesStatus && matchesRisk && matchesDate;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === 'date-asc') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    if (sortBy === 'risk-desc') return b.riskScore - a.riskScore;
    if (sortBy === 'risk-asc') return a.riskScore - b.riskScore;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <HistoryIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Interaction History</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Chronological ledger of infrastructure assessments and detonations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => alert('Feature coming soon!')}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20" onClick={() => alert('Feature coming soon!')}>
            <FileText className="w-4 h-4" /> Batch Report
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4 border-[var(--border-color)] bg-[var(--surface)]">
        <div className="flex flex-col md:flex-row items-center gap-4 py-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <input 
              type="text"
              placeholder="Filter by target resource or analysis type..."
              className="w-full h-11 pl-11 pr-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all placeholder:text-[var(--foreground-muted)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant={showFilters ? "primary" : "outline"} className={cn("h-11 px-4 text-[10px] font-black uppercase tracking-widest gap-2", !showFilters && "bg-[var(--background-secondary)] border-[var(--border-color)]")} onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-3.5 h-3.5" /> Advanced Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--border-color)] mt-4">
                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Timeframe</label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 px-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 90 Days</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Risk Score */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Risk Index</label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 px-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={riskRange}
                      onChange={(e) => setRiskRange(e.target.value)}
                    >
                      <option value="all">Any Risk</option>
                      <option value="low">Minimal (0-30)</option>
                      <option value="medium">Suspicious (31-75)</option>
                      <option value="critical">Critical (76-100)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Analysis Outcome</label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 px-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="clean">Clean</option>
                      <option value="suspicious">Suspicious</option>
                      <option value="malicious">Malicious</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Sort By</label>
                  <div className="relative">
                    <select 
                      className="w-full h-11 px-4 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--foreground)] outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="risk-desc">Highest Risk First</option>
                      <option value="risk-asc">Lowest Risk First</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* History Table */}
      <Card className="border-none bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-8 py-5 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Target Resource</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Analysis Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1b2e]/40">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-8 py-6 flex justify-center"><Skeleton className="h-5 w-10" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-3 w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  filteredHistory.map((scan, idx) => (
                    <motion.tr 
                      key={`${scan.id}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--foreground)]/5 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/results/${scan.id}`)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner",
                            scan.status === 'malicious' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                          )}>
                            {scan.status === 'malicious' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[var(--foreground)] tracking-tight truncate max-w-[300px]">{scan.target}</p>
                            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter">ID: {scan.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex">
                           <Badge variant="info">{scan.type}</Badge>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className={cn(
                          "text-xs font-black inline-block px-2 py-0.5 rounded border",
                          scan.riskScore > 75 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                          scan.riskScore > 30 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {scan.riskScore}%
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground-muted)]">
                           <Calendar className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                           {new Date(scan.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest hidden md:inline-block">Detail View</span>
                            <div 
                              role="button"
                              tabIndex={0}
                              onClick={(e) => handleDelete(e, scan.id)}
                              className={cn(
                                "p-2 rounded-lg transition-colors ms-2",
                                deletingId === scan.id ? "bg-rose-500/20" : "hover:bg-rose-500/10 hover:text-rose-500"
                              )}
                              title="Delete result"
                            >
                              <Trash2 className={cn(
                                "w-4 h-4",
                                deletingId === scan.id ? "text-rose-500 animate-pulse" : "text-[var(--foreground-muted)]"
                              )} />
                            </div>
                            <div className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors hidden sm:block">
                              <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
                            </div>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && filteredHistory.length === 0 && (
          <div className="py-24 text-center">
             <div className="w-20 h-20 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[var(--foreground-muted)]" />
             </div>
             <p className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-widest">No matching assessments found in your ledger.</p>
             <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="mt-4 text-primary">Clear all filters</Button>
          </div>
        )}
      </Card>

      {/* Pagination View */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
         <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em]">Record range: 1 - {filteredHistory.length} of {filteredHistory.length} entries</p>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] w-10 h-10 p-0 rounded-xl" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[1, 2, 3].map(page => (
              <Button 
                key={page}
                variant={page === 1 ? 'primary' : 'ghost'} 
                size="sm" 
                className={cn(
                  "w-10 h-10 p-0 rounded-xl text-xs font-black",
                  page === 1 ? "shadow-lg shadow-primary/20" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="bg-[var(--background-secondary)] border-[var(--border-color)] w-10 h-10 p-0 rounded-xl" onClick={() => alert('Feature coming soon!')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
         </div>
      </div>
    </div>
  );
};

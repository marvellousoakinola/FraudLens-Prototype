import React from 'react';
import { BookOpen, Terminal, Code, Cpu, Activity, Server, Zap, ChevronRight } from 'lucide-react';
import { Card, Badge, Button, cn } from '../../../components/ui';

export const DocumentationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">API Documentation</h1>
          </div>
          <p className="text-sm font-medium text-[var(--foreground-muted)]">Integrate FraudLens into your apps and analysis pipelines.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:p-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Quick Start</h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-6 leading-relaxed">
              Authenticate requests using your API key provided in the API Access settings. Pass the key in the Authorization header as a Bearer token.
            </p>
            <div className="bg-black/30 border border-[var(--border-color)] rounded-xl p-4 overflow-x-auto">
              <code className="text-xs text-primary font-mono block mb-2"># Authentication Example</code>
              <code className="text-xs text-[var(--foreground)] font-mono whitespace-pre">{`curl -X GET "https://api.fraudlens.com/v1/status" \\
  -H "Authorization: Bearer fl_live_your_token_here"`}</code>
            </div>
          </Card>

          <Card className="p-5 md:p-8 border-none bg-[var(--background-secondary)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Endpoints</h3>
            <div className="space-y-4">
              <div className="border border-[var(--border-color)] bg-[var(--surface)] p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-none font-mono">POST</Badge>
                  <span className="text-sm font-bold text-[var(--foreground)] font-mono">/v1/scan/url</span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mb-4">Submit a new URL for heuristic and reputation analysis.</p>
                <div className="bg-black/30 rounded p-3 text-[10px] font-mono text-white/80">
                  {`{
  "target": "https://example.com/login",
  "engine": "heuristic_v2",
  "fast_check": true
}`}
                </div>
              </div>
              <div className="border border-[var(--border-color)] bg-[var(--surface)] p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="info" className="bg-blue-500/10 text-blue-500 border-none font-mono">GET</Badge>
                  <span className="text-sm font-bold text-[var(--foreground)] font-mono">/v1/results/:scanId</span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">Retrieve the results of a previously submitted analysis.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-none bg-[var(--surface)]">
            <h4 className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest mb-4">SDK & Libraries</h4>
            <div className="space-y-3">
               {[
                 { name: 'Node.js', icon: Terminal, color: 'text-green-500' },
                 { name: 'Python', icon: Code, color: 'text-yellow-500' },
                 { name: 'Go', icon: Server, color: 'text-cyan-500' }
               ].map(sdk => (
                 <button key={sdk.name} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)] group" onClick={() => alert('Feature coming soon!')}>
                   <div className="flex items-center gap-3">
                     <sdk.icon className={cn("w-4 h-4", sdk.color)} />
                     <span className="text-xs font-bold text-[var(--foreground)]">{sdk.name}</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-primary transition-colors" />
                 </button>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

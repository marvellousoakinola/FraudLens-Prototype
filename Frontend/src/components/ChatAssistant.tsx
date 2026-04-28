import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send } from 'lucide-react';
import { Button, Input, Badge, cn } from './ui';

interface ChatAssistantProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ chatOpen, setChatOpen }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender:'user'|'agent', text:string}[]>([
    { sender: 'agent', text: 'Hello! I am your FraudLens security assistant. How can I help you today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            onClick={() => setChatOpen(false)}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[var(--background)] border-l border-[var(--border-color)] z-[70] shadow-2xl flex flex-col"
          >
             <div className="h-20 border-b border-[var(--border-color)] flex items-center justify-between px-6 shrink-0 bg-[var(--surface)]">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                   <Sparkles className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-[var(--foreground)] tracking-wide">FraudLens Agent</h3>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                   </p>
                 </div>
               </div>
               <button onClick={() => setChatOpen(false)} className="p-2 text-[var(--foreground-muted)] hover:text-rose-500 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="flex-grow overflow-y-auto p-6 space-y-4 flex flex-col">
               <div className="text-center mb-6">
                 <Badge variant="outline" className="bg-[var(--surface)] text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Today</Badge>
               </div>
               {chatHistory.map((msg, i) => (
                 <div key={i} className={cn("max-w-[85%] rounded-2xl p-4 text-sm font-medium", msg.sender === 'user' ? "bg-primary text-white self-end rounded-br-none shadow-[0_4px_15px_rgba(124,58,237,0.3)]" : "bg-[var(--surface)] border border-[var(--border-main)] text-[var(--foreground)] self-start rounded-bl-none shadow-sm")}>
                   {msg.text}
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>

             <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface)] shrink-0">
                <form 
                  className="relative flex items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(!chatMessage.trim()) return;
                    setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
                    setChatMessage("");
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { sender: 'agent', text: "I've received your query. Analyzing the current security context..." }]);
                    }, 1000);
                  }}
                >
                  <Input 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask the AI assistant..." 
                    className="w-full pr-12 bg-[var(--background)] h-12 rounded-xl"
                  />
                  <Button type="submit" size="sm" className="absolute right-1 w-10 h-10 rounded-lg p-0 bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </form>
                <p className="text-[10px] text-center text-[var(--foreground-muted)] font-bold uppercase tracking-widest mt-3">Messages are secured with E2E encryption</p>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

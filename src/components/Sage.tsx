import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles, Loader2, Zap, BarChart3, Globe2 } from 'lucide-react';
import type { ChatMessage } from '../types';

interface SageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sage: React.FC<SageProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "I am Sage, your conduit to the Sweetwater ecosystem. Whether you're seeking architectural clarity or looking to scale your infrastructure, I'm here to facilitate that flow. How can we evolve your technology today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickActions = [
    { label: "Product Synergy", icon: <Zap className="w-3 h-3" /> },
    { label: "Infrastructure ROI", icon: <BarChart3 className="w-3 h-3" /> },
    { label: "Global Scale", icon: <Globe2 className="w-3 h-3" /> }
  ];

  const handleSend = async (forcedText?: string) => {
    const messageText = forcedText || input.trim();
    if (!messageText || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);
    // Placeholder response - wire up AI later
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Thank you for reaching out through the Sweetwater conduit. Our ecosystem is designed to flow seamlessly with your infrastructure needs. I'd recommend exploring our suite to find the perfect alignment for your goals." }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[70] bg-slate-900/10 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 40, x: 20 }} animate={{ scale: 1, opacity: 1, y: 0, x: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40, x: 20 }} className="fixed bottom-6 right-6 z-[80] w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[650px] max-h-[85vh] border border-slate-100">
            <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg,#3b82f6,#6366f1,#3b82f6)] opacity-10 blur-3xl" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><Sparkles className="w-6 h-6 text-white" /></div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Sage</h3>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /><p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em]">Support & Sales Conduit</p></div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"><X className="w-6 h-6 text-white/50" /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-white text-slate-400 border border-slate-100' : 'bg-blue-600 text-white'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>{m.content}</div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div>
                  <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm">
                    <div className="flex gap-1.5">
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-white">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickActions.map(action => (
                    <button key={action.label} onClick={() => handleSend(action.label)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all uppercase tracking-wider">{action.icon}{action.label}</button>
                  ))}
                </div>
              )}
              <div className="relative group">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Initiate a query..." className="w-full py-4 pl-6 pr-14 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-slate-50 group-hover:bg-white transition-all font-medium text-slate-900" />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-slate-900 text-white disabled:opacity-20 transition-all hover:bg-blue-600 flex items-center justify-center"><Send className="w-5 h-5" /></button>
              </div>
              <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Secure Conduit Active</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

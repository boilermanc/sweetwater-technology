import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Mail, Phone, ArrowRight, MessageSquare, Sparkles, Loader2, RefreshCw, CheckCircle } from 'lucide-react';

type ContactMode = 'inquiry' | 'form' | 'success';

export const Contact: React.FC = () => {
  const [mode, setMode] = useState<ContactMode>('inquiry');
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAsking]);

  const handleAskAI = async () => {
    if (!query.trim() || isAsking) return;
    const userText = query.trim();
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsAsking(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Thank you for your inquiry. Our team will review this and get back to you shortly. If you'd like to formalize this, click 'Crystallize into Request' below." }]);
      setIsAsking(false);
    }, 1000);
  };

  const handleCrystallize = () => {
    const summary = chatHistory.map(m => `${m.role === 'user' ? 'Q' : 'A'}: ${m.text}`).join('\n\n');
    setFormState(prev => ({ ...prev, message: `Summary of our interaction:\n${summary}` }));
    setMode('form');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('success');
    setTimeout(() => {
      setMode('inquiry');
      setChatHistory([]);
      setFormState({ name: '', email: '', message: '' });
    }, 6000);
  };

  return (
    <section id="contact" className="relative py-32 px-6 scroll-mt-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-blue-100 rounded-full" />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">The Source</span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">Initiate <br /><span className="italic text-slate-400 font-light text-4xl md:text-6xl">the flow.</span></h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-12 font-medium">Don't just fill out a form. Engage with our live inquiry system to refine your vision before reaching the team.</p>
            <div className="space-y-8">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email our lab", val: "flow@sweetwater.tech" },
                { icon: <MapPin className="w-5 h-5" />, label: "Visit the reservoir", val: "San Francisco, CA" },
                { icon: <Phone className="w-5 h-5" />, label: "Call the stream", val: "+1 (555) WATER-TECH" }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">{item.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">{item.val}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div className="lg:col-span-7 relative min-h-[500px]">
            <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative z-10 h-full flex flex-col">
              <AnimatePresence mode="wait">
                {mode === 'inquiry' && (
                  <motion.div key="inquiry" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500" /><h3 className="font-bold text-slate-900">Live Inquiry Stream</h3></div>
                      <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assistant Online</span></div>
                    </div>
                    <div className="flex-1 min-h-[250px] max-h-[350px] overflow-y-auto mb-6 pr-2 space-y-4">
                      {chatHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-3xl">
                          <MessageSquare className="w-8 h-8 text-slate-200 mb-4" />
                          <p className="text-slate-400 text-sm font-medium">Ask a question about our apps, pricing, or how we can help your business flow.</p>
                        </div>
                      )}
                      {chatHistory.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>{m.text}</div>
                        </div>
                      ))}
                      {isAsking && (<div className="flex justify-start"><div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100"><Loader2 className="w-4 h-4 text-blue-500 animate-spin" /></div></div>)}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskAI()} placeholder="Type your question..." className="w-full py-4 pl-6 pr-14 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-900" />
                        <button onClick={handleAskAI} disabled={!query.trim() || isAsking} className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-slate-900 text-white disabled:opacity-20 transition-all hover:bg-blue-600"><Send className="w-5 h-5" /></button>
                      </div>
                      <div className="flex items-center gap-4"><div className="h-px flex-1 bg-slate-100" /><span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or</span><div className="h-px flex-1 bg-slate-100" /></div>
                      <button onClick={chatHistory.length > 0 ? handleCrystallize : () => setMode('form')} className="w-full py-4 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group">
                        {chatHistory.length > 0 ? 'Crystallize into Request' : 'Direct to Team'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {mode === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={() => setMode('inquiry')} className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-70"><RefreshCw className="w-3 h-3" /> Back to Inquiry</button>
                      <h3 className="font-bold text-slate-900">Finalize Request</h3>
                    </div>
                    <form onSubmit={handleFinalSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                          <input type="text" required value={formState.name} onChange={e => setFormState(f => ({...f, name: e.target.value}))} placeholder="Your full name" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-900" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                          <input type="email" required value={formState.email} onChange={e => setFormState(f => ({...f, email: e.target.value}))} placeholder="name@company.com" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-900" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Context</label>
                        <textarea rows={5} required value={formState.message} onChange={e => setFormState(f => ({...f, message: e.target.value}))} placeholder="How can we help?" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium text-slate-900 resize-none text-sm" />
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">Send to Reservoir<ArrowRight className="w-5 h-5" /></motion.button>
                    </form>
                  </motion.div>
                )}
                {mode === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600"><CheckCircle className="w-12 h-12" /></div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">Request Flowing!</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">Our experts have received your inquiry. A response will ripple back to you shortly.</p>
                    <div className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Connection Established</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

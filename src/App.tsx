import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { AppGrid } from './components/AppGrid';
import { Contact } from './components/Contact';
import { Sage } from './components/Sage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AppDetail } from './components/AppDetail';
import type { AppProject, BackgroundTexture } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppProject | null>(null);
  const [showSage, setShowSage] = useState(false);
  const [activeTexture, setActiveTexture] = useState<BackgroundTexture>('flow');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedApp(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-800 transition-colors duration-700">
      <AnimatedBackground texture={activeTexture} />

      <Header
        onOpenAI={() => setShowSage(true)}
        activeTexture={activeTexture}
        onTextureChange={setActiveTexture}
      />

      <main className="relative z-10">
        <Hero />
        <Philosophy />

        <div id="portfolio" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
             <motion.div
               animate={{ rotate: [0, 360] }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,#eff6ff,#f5f3ff,#f0f9ff,#eff6ff)] opacity-[0.5] blur-[100px]"
             />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative z-10"
          >
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Our Ecosystem
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Fluid, powerful, and intentionally designed. Explore the suite of applications defining the next era of digital interaction.
            </p>
          </motion.div>

          <AppGrid onSelectApp={setSelectedApp} />
        </div>

        <Contact />
      </main>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSage(true)}
        aria-label="Open Conduit Sage"
        className="fixed bottom-8 right-8 z-[65] w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-blue-500/20 flex items-center justify-center group overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <Sparkles className="w-7 h-7 relative z-10" />
      </motion.button>

      <footer className="relative z-10 py-12 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Sweetwater</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Sweetwater Technology. All rights reserved.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedApp && (
          <AppDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </AnimatePresence>

      <Sage isOpen={showSage} onClose={() => setShowSage(false)} />
    </div>
  );
};

export default App;

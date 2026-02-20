import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { AppGrid } from './components/AppGrid';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AppDetail } from './components/AppDetail';
import { RekkrdDetail } from './components/cards/RekkrdDetail';
import type { AppProject } from './types';

const App: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppProject | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

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
      <AnimatedBackground texture="flow" />

      <Header />

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

      <footer className="relative z-10 py-12 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600" />
            <span className="text-xl tracking-tight text-slate-900">
              <span className="font-bold">Sweetwater</span>
              <span style={{ fontFamily: "'Satisfy', cursive" }} className="ml-1 text-2xl font-semibold"><span className="text-blue-600">T</span>echnology</span>
            </span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Sweetwater Technology. All rights reserved.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedApp && (
          selectedApp.id === 'rekkrd' ? (
            <RekkrdDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
          ) : (
            <AppDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

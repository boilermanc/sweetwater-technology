import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { AppGrid } from './components/AppGrid';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';
import type { AppProject } from './types';
import { SweetwaterLogo } from './components/SweetwaterLogo';
import { NewsDetail, NewsIndex, NotFound } from './components/News';
import { findNewsArticle } from './news';
import { normalizePath } from './seo';
import { ServiceDetail, ServicesIndex, WorkDetail, WorkIndex } from './components/MarketingPages';
import { findService, findWorkProfile, SERVICES } from './marketing';
import { ContinuumPage } from './components/ContinuumPage';

const AppDetail = lazy(() => import('./components/AppDetail').then((module) => ({ default: module.AppDetail })));
const RekkrdDetail = lazy(() => import('./components/cards/RekkrdDetail').then((module) => ({ default: module.RekkrdDetail })));

interface AppProps {
  path?: string;
}

const App: React.FC<AppProps> = ({ path }) => {
  const [selectedApp, setSelectedApp] = useState<AppProject | null>(null);
  const currentPath = normalizePath(path ?? (typeof window === 'undefined' ? '/' : window.location.pathname));
  const newsArticle = currentPath.startsWith('/news/')
    ? findNewsArticle(currentPath.slice('/news/'.length))
    : undefined;
  const service = currentPath.startsWith('/services/')
    ? findService(currentPath.slice('/services/'.length))
    : undefined;
  const workProfile = currentPath.startsWith('/work/')
    ? findWorkProfile(currentPath.slice('/work/'.length))
    : undefined;

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

      {currentPath === '/' ? (
        <main className="relative z-10">
          <Hero />
          <Philosophy />

          <div id="portfolio" className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
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
            className="mb-8 sm:mb-12 relative z-10"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 sm:mb-4">
              Our Ecosystem
            </h2>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl">
              Fluid, powerful, and intentionally designed. Explore the suite of applications defining the next era of digital interaction.
            </p>
          </motion.div>

          <AppGrid onSelectApp={setSelectedApp} />

          <section aria-labelledby="services-heading" className="mt-16 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Services</p>
                <h2 id="services-heading" className="mt-3 text-3xl font-black tracking-tight text-slate-900">Software built around your workflow</h2>
              </div>
              <a href="/services" className="font-bold text-blue-600 hover:text-blue-700">View all services →</a>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SERVICES.map((item) => (
                <a key={item.slug} href={`/services/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md">
                  <h3 className="font-black text-slate-900">{item.shortTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </a>
              ))}
            </div>
          </section>
          </div>

          <Contact />
        </main>
      ) : currentPath === '/continuum' ? (
        <ContinuumPage />
      ) : currentPath === '/services' ? (
        <ServicesIndex />
      ) : service ? (
        <ServiceDetail service={service} />
      ) : currentPath === '/work' ? (
        <WorkIndex />
      ) : workProfile ? (
        <WorkDetail profile={workProfile} />
      ) : currentPath === '/news' ? (
        <NewsIndex />
      ) : newsArticle ? (
        <NewsDetail article={newsArticle} />
      ) : (
        <NotFound />
      )}

      <footer className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <SweetwaterLogo markClassName="h-8 w-8" />
          <div className="text-slate-500 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} Sweetwater Technology. All rights reserved.
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedApp && (
            selectedApp.id === 'rekkrd' ? (
              <RekkrdDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
            ) : (
              <AppDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
            )
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default App;

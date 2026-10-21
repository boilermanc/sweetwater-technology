import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FloatingAiGuide } from './components/FloatingAiGuide';
import { HomeSections } from './components/HomeSections';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';
import type { AppProject } from './types';
import { Footer } from './components/Footer';
import { Book } from './pages/Book';
import { LegalDraft } from './pages/LegalDraft';
import { NewsDetail, NewsIndex, NotFound } from './components/News';
import { findNewsArticle } from './news';
import { normalizePath } from './seo';
import { ServiceDetail, ServicesIndex, WorkDetail, WorkIndex } from './components/MarketingPages';
import { findService, findWorkProfile } from './marketing';
import { HeadwatersPage } from './pages/Headwaters';
import { ContinuumPage } from './components/ContinuumPage';
import { CardLanding } from './pages/CardLanding';
import { CardTestPage } from './pages/CardTestPage';
import { SageEmailPreview } from './pages/SageEmailPreview';
import { ResourcesIndex, ResourceDetail, ResourceDownload } from './pages/Resources';
import { findResource } from './resources';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { SweetwaterLogo } from './components/SweetwaterLogo';

const Portal = lazy(() => import('./portal/Portal'));
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
  const resourceSlug = currentPath.startsWith('/resources/')
    ? currentPath.slice('/resources/'.length).replace(/\/download$/, '')
    : '';
  const resource = findResource(resourceSlug);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedApp(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const anchor = window.location.hash.slice(1);
      if (anchor) document.getElementById(anchor)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [currentPath]);

  if (currentPath === '/portal') {
    return <Suspense fallback={<main className="min-h-screen grid place-items-center text-slate-600" role="status">Loading workspace…</main>}><Portal /></Suspense>;
  }

  if (currentPath === '/card/test') {
    return <CardTestPage />;
  }

  if (currentPath === '/card/email-preview') {
    return <SageEmailPreview />;
  }

  if (currentPath === '/ai-help') return <CardLanding aiHelp />;
  if (currentPath === '/app-idea') return <CardLanding appIdea />;

  if (currentPath === '/card') {
    return <CardLanding />;
  }

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-800 transition-colors duration-700">
      <AnimatedBackground texture="flow" />

      {currentPath !== '/portfolio' && <Header />}

      {currentPath === '/' ? (
        <main className="relative z-10">
          <Hero />
          <HomeSections onSelectApp={setSelectedApp} />
          <Contact />
          <FloatingAiGuide />
        </main>
      ) : currentPath === '/terms' || currentPath === '/privacy' ? (
        <LegalDraft kind={currentPath === '/terms' ? 'terms' : 'privacy'} />
      ) : currentPath === '/book' ? (
        <Book />
      ) : currentPath === '/portfolio' ? (
        <Portfolio onSelectApp={setSelectedApp} />
      ) : currentPath === '/about' ? (
        <About />
      ) : currentPath === '/headwaters' ? (
        <HeadwatersPage />
      ) : currentPath === '/headwaters/continuum' ? (
        <ContinuumPage />
      ) : currentPath === '/services' ? (
        <ServicesIndex />
      ) : service ? (
        <ServiceDetail service={service} />
      ) : currentPath === '/work' ? (
        <WorkIndex onSelectApp={setSelectedApp} />
      ) : workProfile ? (
        <WorkDetail profile={workProfile} />
      ) : currentPath === '/news' ? (
        <NewsIndex />
      ) : currentPath === '/resources' ? (
        <ResourcesIndex />
      ) : resource && currentPath.endsWith('/download') ? (
        <ResourceDownload resource={resource} />
      ) : resource ? (
        <ResourceDetail resource={resource} />
      ) : newsArticle ? (
        <NewsDetail article={newsArticle} />
      ) : (
        <NotFound />
      )}

      {currentPath === '/portfolio' ? (
        <footer className="relative z-10 border-t border-slate-100 bg-white/50 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <SweetwaterLogo markClassName="h-8 w-8" />
            <p className="text-center text-xs text-slate-500 sm:text-sm">© {new Date().getFullYear()} Sweetwater Technology. All rights reserved.</p>
          </div>
        </footer>
      ) : <Footer />}

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

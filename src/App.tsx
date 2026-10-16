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
import { ManageBooking } from './pages/ManageBooking';
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

      <Header />

      {currentPath === '/' ? (
        <main className="relative z-10">
          <Hero />
          <HomeSections onSelectApp={setSelectedApp} />
          <Contact />
          <FloatingAiGuide />
        </main>
      ) : currentPath === '/terms' || currentPath === '/privacy' ? (
        <LegalDraft kind={currentPath === '/terms' ? 'terms' : 'privacy'} />
      ) : currentPath === '/book/manage' ? (
        <ManageBooking />
      ) : currentPath === '/book' ? (
        <Book />
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

      <Footer />

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

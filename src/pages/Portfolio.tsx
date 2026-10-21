import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { AppGrid } from '../components/AppGrid';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';

export function Portfolio({ onSelectApp }: { onSelectApp: (app: AppProject) => void }) {
  return (
    <>
      <a href="#portfolio-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-4">Skip to content</a>
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a>
        <a href="/#contact-form" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>
      <main id="portfolio-main" className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="py-14 sm:py-24" aria-labelledby="portfolio-title">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">The Sweetwater portfolio</p>
          <h1 id="portfolio-title" className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">Different ideas.<br /><span className="text-blue-600">Real-world software.</span></h1>
          <div className="mt-8 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">From the greenhouse to the record shelf, we build software around the things people do. Explore the apps, businesses, and everyday ideas we’ve helped bring to life.</p>
            <a href="#projects" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700">Explore our work <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </section>
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-6 border-t border-slate-200 pt-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 id="projects-title" className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Our work <span className="ml-2 align-middle text-sm font-medium text-slate-500">{String(PROJECTS.length).padStart(2, '0')} projects</span></h2>
            <p className="text-sm text-slate-600">Select a project to take a closer look.</p>
          </div>
          <AppGrid onSelectApp={onSelectApp} />
        </section>
        <section aria-labelledby="portfolio-contact" className="mt-16 rounded-3xl bg-slate-950 px-6 py-12 text-white sm:mt-24 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">What’s next?</p>
          <h2 id="portfolio-contact" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">Your idea could be next.</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">A new product, a better workflow, or a problem worth solving. Tell us what you have in mind.</p>
          <a href="/#contact-form" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 font-bold text-slate-950 hover:bg-blue-100">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
      </main>
    </>
  );
}

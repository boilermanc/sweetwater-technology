import { ArrowDown, ArrowUpRight } from 'lucide-react';

export const Hero = () => (
  <section id="top" className="relative overflow-hidden px-5 pb-16 pt-36 sm:px-8 sm:pb-24 sm:pt-44 scroll-mt-24">
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
    <div className="relative mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Software that flows like water</p>
      <h1 className="mt-7 max-w-4xl text-6xl font-black leading-[1.04] tracking-tight text-slate-900 sm:text-8xl">Get your<br /><span className="text-blue-600">hours back.</span></h1>
      <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">Smoother workflows. Connected systems. Better follow-through.<br />Spend less time moving information and more time winning and doing the work.</p>
      <a href="#contact-form" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-center font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Tell us what’s slowing you down <ArrowDown size={18} aria-hidden="true" /></a>
      <div><a href="/book" className="mt-5 inline-flex min-h-11 items-center font-bold text-blue-700 underline">Book a free 20-minute call →</a></div>
      <div className="mt-12 grid max-w-3xl gap-5 border-t border-slate-200 pt-7 sm:grid-cols-2">
        <a href="/ai-help?src=homepage" className="rounded-xl p-2 font-bold text-slate-900 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">Explore practical AI <ArrowUpRight className="ml-1 inline" size={18} aria-hidden="true" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Start with one task that takes too much time.</span></a>
        <a href="/app-idea?src=homepage" className="rounded-xl p-2 font-bold text-slate-900 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">Have an app idea? <ArrowUpRight className="ml-1 inline" size={18} aria-hidden="true" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Talk it through. A rough idea is enough.</span></a>
      </div>
    </div>
  </section>
);

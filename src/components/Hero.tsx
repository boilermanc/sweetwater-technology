import { ArrowDown, ArrowUpRight } from 'lucide-react';

export const Hero = () => (
  <section id="top" className="relative overflow-hidden px-5 pb-16 pt-36 sm:px-8 sm:pb-24 sm:pt-44 scroll-mt-24">
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
    <div className="relative mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Software built around your business</p>
      <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.04] tracking-tight text-slate-900 sm:text-7xl">Find better ways to use <span className="text-blue-600">AI in your business.</span></h1>
      <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">We help small and growing businesses spot the repetitive work, test practical AI, and build the tools that make it stick.</p>
      <a href="/book" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-center font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Talk through an AI opportunity <ArrowUpRight size={18} aria-hidden="true" /></a>
      <p className="mt-5 max-w-2xl leading-7 text-slate-600">Less copying, faster follow-up, more time for the work that matters.</p><div><a href="#portfolio" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-blue-700 underline">See the work we’ve built <ArrowDown size={18} aria-hidden="true" /></a></div>
      <div className="mt-12 grid max-w-3xl gap-5 border-t border-slate-200 pt-7 sm:grid-cols-2">
        <a href="/ai-help?src=homepage" className="rounded-xl p-2 font-bold text-slate-900 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">Explore practical AI <ArrowUpRight className="ml-1 inline" size={18} aria-hidden="true" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Start with one task that takes too much time.</span></a>
        <a href="/app-idea?src=homepage" className="rounded-xl p-2 font-bold text-slate-900 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">Have an app idea? <ArrowUpRight className="ml-1 inline" size={18} aria-hidden="true" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Talk it through. A rough idea is enough.</span></a>
      </div>
    </div>
  </section>
);

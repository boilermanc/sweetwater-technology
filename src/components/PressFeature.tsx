import { ArrowRight } from 'lucide-react';
import { CHATGPT_FEATURE } from '../news';

export function PressFeature() {
  return (
    <section aria-labelledby="press-feature-heading" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-blue-100 bg-white/90 shadow-sm md:grid-cols-[15rem_1fr]">
        <div className="flex flex-col justify-between gap-5 bg-slate-900 p-7 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">In the spotlight</p>
          <p className="text-2xl font-black leading-tight">Featured in<br />{CHATGPT_FEATURE.publication}</p>
          <p className="text-sm text-slate-300">{CHATGPT_FEATURE.publishedOn}</p>
        </div>
        <div className="p-7 sm:p-8">
          <h2 id="press-feature-heading" className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{CHATGPT_FEATURE.title}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">Meet Clint and Sheree, and explore the farm work behind our software, automation, and connected systems.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2">
            <a href={CHATGPT_FEATURE.url} className="inline-flex min-h-11 items-center gap-2 font-bold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Read the feature <ArrowRight aria-hidden="true" size={18} /></a>
            <a href={`/news/${CHATGPT_FEATURE.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 underline underline-offset-4 hover:text-blue-700">The story in our newsroom</a>
          </div>
        </div>
      </div>
    </section>
  );
}

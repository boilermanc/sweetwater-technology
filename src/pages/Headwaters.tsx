import { ArrowRight } from 'lucide-react';
import { HEADWATERS_INTRO, HEADWATERS_PAPERS, paperPath } from '../headwaters';

export function HeadwatersPage() {
  return <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Ideas and perspectives</p>
    <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">Headwaters</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{HEADWATERS_INTRO}</p>
    <p className="mt-4 max-w-2xl leading-7 text-slate-600">For people curious about the ideas behind the tools. These are points of view to explore, not products or services.</p>
    <section aria-label="Papers" className="mt-12 grid gap-6 sm:grid-cols-2">
      {HEADWATERS_PAPERS.map(paper => <article key={paper.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{paper.status}</span><time dateTime={paper.datePublished} className="text-sm text-slate-500">{new Date(`${paper.datePublished}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></div>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900"><a href={paperPath(paper)} className="hover:text-blue-600">{paper.title}</a></h2>
        <p className="mt-4 flex-1 leading-7 text-slate-600">{paper.summary}</p>
        <a href={paperPath(paper)} className="mt-8 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700">Read the paper <ArrowRight size={18} aria-hidden="true" /><span className="sr-only">: {paper.title}</span></a>
      </article>)}
    </section>
  </main>;
}

import { ArrowRight, BookOpen, Check } from 'lucide-react';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';

const featured = [
  { id: 'lanewise', copy: 'Freight quote emails become ready-to-review drafts.' },
  { id: 'spectiq', copy: 'Keep inspection bookings, payments and follow-ups together.' },
  { id: 'sproutify-farm', copy: 'Tools for the everyday work of growing, built alongside our farm.' },
];
const services = [
  { slug: 'custom-web-applications', title: 'Custom web apps', copy: 'Tools that fit how you work.' },
  { slug: 'ai-workflow-automation', title: 'AI helpers', copy: 'AI drafts it. You approve it.' },
  { slug: 'mobile-app-development', title: 'Mobile apps', copy: 'Useful tools for customers and crews.' },
];
const sectionClass = 'mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20';

export function HomeSections({ onSelectApp }: { onSelectApp: (app: AppProject) => void }) {
  return <>
    <section className={sectionClass} aria-labelledby="problems-title">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">For small and growing businesses</p>
      <h2 id="problems-title" className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Win the work. Keep it moving.</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">{['Get quotes out sooner', 'Follow up before interest fades', 'Know the next step on every deal', 'Connect the tools your team already uses', 'Stop copying the same details twice', 'Make handoffs clear from sales to delivery'].map(text => <p key={text} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/80 p-5 font-semibold text-slate-700"><Check className="shrink-0 text-blue-600" size={20} aria-hidden="true" />{text}</p>)}</div>
      <p className="mt-5 max-w-2xl leading-7 text-slate-600">A slow reply can cost you good work. Disconnected tools can slow down everything that follows. We help connect inquiries, quotes, schedules and follow-ups, so information moves with the job and your team knows what comes next.</p>
    </section>
    <section id="portfolio" className={sectionClass + ' scroll-mt-24'} aria-labelledby="proof-title">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Ideas put into practice</p><h2 id="proof-title" className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Built around real work.</h2></div><a href="/work" className="font-bold text-blue-700 hover:underline">See all our work →</a></div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{featured.map(item => {
        const project = PROJECTS.find(app => app.id === item.id)!;
        return <article key={item.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-sm">
          <img src={project.image} alt="" width={project.imageWidth} height={project.imageHeight} loading="lazy" className="aspect-[16/10] w-full bg-slate-50 object-contain p-6" />
          <div className="flex flex-1 flex-col p-6"><h3 className="text-xl font-black text-slate-900">{project.title}</h3><p className="mt-3 flex-1 leading-7 text-slate-600">{item.copy}</p><button onClick={() => onSelectApp(project)} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-lg font-bold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600" aria-label={'Learn more about ' + project.title}>Learn more <ArrowRight size={18} aria-hidden="true" /></button></div>
        </article>;
      })}</div>
    </section>
    <section className={sectionClass} aria-labelledby="process-title">
      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">People first. Practical steps.</p>
        <h2 id="process-title" className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Start with one problem.</h2>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600">Clint brings the software-building experience. Sheree brings experience in implementation, training and helping teams adopt new systems.</p>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">{[['Understand the work', 'Tell us what’s difficult and who it affects.'], ['Agree what’s worth changing', 'We define the scope and price before paid work begins.'], ['Build it. Help your team use it.', 'Testing, training and handover are part of the work.']].map(([title, copy], i) => <li key={title}><span className="text-sm font-bold text-blue-600">0{i + 1}</span><h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{copy}</p></li>)}</ol>
        <a href="/about" className="mt-8 inline-block font-bold text-blue-700 hover:underline">Meet Clint and Sheree →</a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{services.map(service => <a key={service.slug} href={'/services/' + service.slug} className="rounded-2xl border border-slate-200 bg-white/75 p-6 hover:border-blue-300"><h3 className="font-bold text-slate-900">{service.title}</h3><p className="mt-2 leading-6 text-slate-600">{service.copy}</p><span className="mt-4 inline-block text-sm font-bold text-blue-700">Learn more →</span></a>)}</div>
    </section>
    <section className={sectionClass} aria-labelledby="guide-title">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-7 sm:flex-row sm:items-center sm:p-10"><BookOpen size={38} className="shrink-0 text-blue-600" aria-hidden="true" /><div className="flex-1"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free guide</p><h2 id="guide-title" className="mt-3 text-2xl font-black text-slate-900">New to AI? Start here.</h2><p className="mt-3 leading-7 text-slate-600">Five simple things to try this week. No technical skills needed.</p></div><a href="/resources/try-ai-this-week" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-blue-700">Read the guide <ArrowRight size={18} aria-hidden="true" /></a></div>
    </section>
  </>;
}

import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { ServiceContactForm } from './ServiceContactForm';
import { AI_SERVICES_COPY, SERVICES_COPY } from '../servicesContent';

const card = 'rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm';
const heading = 'text-3xl font-black tracking-tight text-slate-900 sm:text-4xl';

function Page({ children }: { children: ReactNode }) {
  return <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6"><div className="mx-auto max-w-6xl">{children}<ServiceContactForm /></div></main>;
}

function Intro({ title, description }: { title: string; description: string }) {
  return <header className="max-w-4xl">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Services</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{title}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">{description}</p>
    <a href="#service-contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">Tell us what's slowing you down <ArrowRight aria-hidden="true" size={18} /></a>
  </header>;
}

export function ServicesPage() {
  return <Page>
    <Intro {...SERVICES_COPY} />
    <p className="mt-10 max-w-3xl text-lg leading-8 text-slate-600">For inspectors, real estate agents, contractors, busy offices—and anyone spending too much time on paperwork.</p>
    <section className="mt-20" aria-labelledby="what-build">
      <h2 id="what-build" className={heading}>What we build</h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          ['Custom web apps', 'Keep jobs, customers and paperwork in one place.', 'custom-web-applications'],
          ['AI helpers', 'Get quotes and replies ready faster. You approve what goes out.', 'ai-workflow-automation'],
          ['Mobile apps', 'Help customers request work and your crew update jobs on the go.', 'mobile-app-development'],
        ].map(([title, detail, slug]) => <article key={slug} className={`${card} flex flex-col`}><h3 className="text-2xl font-black text-slate-900">{title}</h3><p className="mt-4 flex-1 leading-7 text-slate-600">{detail}</p><a href={`/services/${slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700">Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight aria-hidden="true" size={18} /></a></article>)}
      </div>
    </section>
    <section className="mt-20 rounded-[2rem] bg-slate-900 p-8 text-white sm:p-12" aria-labelledby="ai-worries">
      <h2 id="ai-worries" className="text-3xl font-black tracking-tight sm:text-4xl">Worried about AI?</h2>
      <dl className="mt-8 grid gap-8 md:grid-cols-3">
        {[
          ['Too expensive?', 'We start small. You know the cost before we begin.'],
          ['Replace my people?', 'We focus on helping your team with repetitive work. You decide what changes.'],
          ['Not a tech person?', "You don't need to be. Just tell us the problem."],
        ].map(([question, answer]) => <div key={question}><dt className="text-lg font-bold">{question}</dt><dd className="mt-3 leading-7 text-slate-300">{answer}</dd></div>)}
      </dl>
    </section>
  </Page>;
}

export function AiServicesPage() {
  return <Page>
    <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-600"><a href="/services" className="hover:text-blue-600">Services</a><span aria-hidden="true"> / </span><span aria-current="page">AI helpers</span></nav>
    <Intro title={AI_SERVICES_COPY.title} description={AI_SERVICES_COPY.description} />
    <section className="mt-20" aria-labelledby="sound-familiar">
      <h2 id="sound-familiar" className={heading}>Sound familiar?</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">{[
        'Hours spent retyping info from emails and forms.',
        'Quotes and paperwork that take too long — or never go out.',
        'The same details entered in three places.',
      ].map(text => <li key={text} className={`${card} text-lg leading-8 text-slate-600`}>{text}</li>)}</ul>
    </section>
    <section className="mt-20" aria-labelledby="what-you-get">
      <h2 id="what-you-get" className={heading}>What you get</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{[
        ['Less starting from scratch', 'Useful drafts give your team something to review and improve.'],
        ['Fewer mistakes', 'Less retyping. Fewer chances to miss a detail.'],
        ['You stay in control', "We agree which steps need your approval and build in those checks."],
      ].map(([title, detail]) => <article key={title} className={card}><h3 className="text-xl font-black text-slate-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{detail}</p></article>)}</div>
    </section>
    <section className="mt-20" aria-labelledby="how-it-works">
      <h2 id="how-it-works" className={heading}>How it works</h2>
      <ol className="mt-8 grid gap-5 md:grid-cols-3">{['Tell us the problem.', 'We talk it through.', 'You get a clear plan and price before anything starts.'].map((step, index) => <li key={step} className="rounded-3xl bg-slate-900 p-7 text-white"><span aria-hidden="true" className="text-sm font-black text-blue-300">0{index + 1}</span><p className="mt-4 text-xl font-bold leading-8">{step}</p></li>)}</ol>
    </section>
    <section className="mt-20" aria-labelledby="see-example">
      <h2 id="see-example" className={heading}>See it in practice</h2>
      <article className={`${card} mt-8 max-w-2xl`}><h3 className="text-2xl font-black text-slate-900">LaneWise</h3><p className="mt-3 leading-7 text-slate-600">Freight quote emails become ready-to-review drafts.</p><a href="/work/lanewise" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700">See how LaneWise works <ArrowRight aria-hidden="true" size={18} /></a></article>
    </section>
    <section className="mt-20 max-w-4xl" aria-labelledby="common-questions">
      <h2 id="common-questions" className={heading}>A few common questions</h2>
      <div className="mt-8 space-y-5">{AI_SERVICES_COPY.faqs.map(faq => <article key={faq.question} className={card}><h3 className="text-xl font-bold text-slate-900">{faq.question}</h3><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></article>)}</div>
    </section>
  </Page>;
}

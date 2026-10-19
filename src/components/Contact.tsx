import { HOME_FAQS } from '../homeContent';
import { ContactForm } from './ServiceContactForm';

export const Contact = () => <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
  <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">A few answers first</p><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Keep it simple.</h2><div className="mt-7 space-y-3">{HOME_FAQS.map(faq => <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white/80 p-5"><summary className="cursor-pointer font-bold text-slate-900">{faq.question}</summary><p className="mt-4 leading-7 text-slate-600">{faq.answer}</p></details>)}</div></div>
    <div id="contact-form" className="scroll-mt-28"><h2 className="text-3xl font-black tracking-tight text-slate-900">Tell us what’s slowing you down</h2><p className="mb-7 mt-4 leading-7 text-slate-600">A few sentences is plenty. Clint will follow up.</p><p className="mb-6">Prefer to talk? <a href="/book" className="inline-flex min-h-11 items-center font-bold text-blue-700 underline">Book a free 20-minute call →</a></p><ContactForm /></div>
  </div>
</section>;

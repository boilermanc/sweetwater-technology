import { FloatingAiGuide } from '../components/FloatingAiGuide';
import { ArrowRight } from 'lucide-react';
const experiments = [
  ['Draft an email reply', 'Make up a typical customer question. Ask for a friendly reply, then edit it to sound like you.'],
  ['Summarize something long', 'Use a public manual or article. Ask for the key points, then compare them with the original.'],
  ['Clean up rough notes', 'Use fictional notes to draft a letter or estimate. Check every name, amount and detail.'],
  ['Write a job posting', 'Describe a role and its day-to-day tasks. Ask for a clear first draft.'],
  ['Answer common questions', 'List questions customers often ask, without personal details. Have AI draft answers for you to check.'],
];
export function TryAiGuide() {
  return <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8"><article>
    <nav aria-label="Breadcrumb" className="text-sm font-semibold text-blue-700"><a href="/resources" className="hover:underline">Resources</a> / Try AI This Week</nav>
    <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Guide</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">Try AI This Week</h1><p className="mt-5 text-xl leading-8 text-slate-600">A simple starter guide for small businesses.</p><a href="/downloads/try-ai-this-week.pdf" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-bold text-blue-700 underline">Open the printable guide (PDF)<span className="sr-only"> (opens in a new tab)</span></a>
    <section className="mt-12"><h2 className="text-2xl font-black text-slate-900">Start with what wastes your time.</h2><p className="mt-4 leading-8 text-slate-600">Pick one task you repeat every week and dread. That’s your first experiment. Use an AI tool you already have access to, with fictional examples or public information.</p></section>
    <section className="mt-12"><h2 className="text-2xl font-black text-slate-900">Five things to try this week</h2><ol className="mt-6 space-y-5">{experiments.map(([title, copy], i) => <li key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-6"><h3 className="text-lg font-bold text-slate-900"><span className="mr-3 text-blue-600">{i + 1}.</span>{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></li>)}</ol></section>
    <section className="mt-12"><h2 className="text-2xl font-black text-slate-900">What not to put in</h2><p className="mt-4 leading-8 text-slate-600">No customer, patient or client personal information. No passwords, account numbers or confidential business documents.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-black text-slate-900">Check its work</h2><p className="mt-4 leading-8 text-slate-600">AI drafts. You decide. Check the facts and read everything before it goes out.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-black text-slate-900">When to call someone</h2><p className="mt-4 leading-8 text-slate-600">When the task happens every day, involves several tools, or needs a consistent approach for your team. We can help you decide what’s worth changing.</p><a href="/#contact-form" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700">Tell us what’s slowing you down <ArrowRight size={18} aria-hidden="true" /></a><div><a href="/book" className="mt-5 inline-flex min-h-11 items-center font-bold text-blue-700 underline">Book a free 20-minute call →</a></div></section>
  </article><FloatingAiGuide /></main>;
}

import { LEGAL_DRAFTS } from '../legalContent';

export function LegalDraft({ kind }: { kind: keyof typeof LEGAL_DRAFTS }) {
  const draft = LEGAL_DRAFTS[kind];
  return <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Sweetwater Technology LP</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{draft.title}</h1>
    <aside aria-label="Draft status" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><p className="font-bold">Draft for review — not an approved policy.</p><p className="mt-2 text-sm leading-6">No effective date has been assigned. Business details and legal review are still required before publication.</p></aside>
    <p className="mt-8 text-lg leading-8 text-slate-600">{draft.introduction}</p>
    {draft.sections.map(section => <section key={section.title} className="mt-9"><h2 className="text-xl font-bold text-slate-900">{section.title}</h2><p className="mt-3 leading-8 text-slate-600">{section.text}</p></section>)}
    <aside aria-labelledby="legal-review-title" className="mt-10 rounded-2xl border border-slate-200 bg-white/85 p-6"><h2 id="legal-review-title" className="font-bold text-slate-900">Items to resolve before approval</h2><p className="mt-3 text-sm leading-7 text-slate-600">{draft.review}</p></aside>
    <a href="mailto:team@sweetwater.technology" className="mt-8 inline-block font-bold text-blue-700 underline">Contact Sweetwater</a>
  </main>;
}

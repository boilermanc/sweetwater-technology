import { LEGAL_EFFECTIVE_DATE, LEGAL_PAGES } from '../legalContent';

export function LegalPage({ kind }: { kind: keyof typeof LEGAL_PAGES }) {
  const page = LEGAL_PAGES[kind];
  return <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Sweetwater Technology LP</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{page.title}</h1>
    <p className="mt-5 text-sm text-slate-500">Effective <time dateTime={LEGAL_EFFECTIVE_DATE}>October 18, 2026</time></p>
    <p className="mt-8 text-lg leading-8 text-slate-600">{page.introduction}</p>
    {page.sections.map(section => <section key={section.title} className="mt-9"><h2 className="text-xl font-bold text-slate-900">{section.title}</h2><p className="mt-3 leading-8 text-slate-600">{section.text}</p></section>)}
    {kind === 'privacy' && <section className="mt-9" aria-labelledby="provider-notices"><h2 id="provider-notices" className="text-xl font-bold text-slate-900">Related provider notices</h2><ul className="mt-3 space-y-3 text-blue-700 underline"><li><a href="https://www.cloudflare.com/turnstile-privacy-policy/">Cloudflare Turnstile Privacy Addendum</a></li><li><a href="https://ai.google.dev/gemini-api/terms">Google Gemini API terms and data use</a></li></ul></section>}
    <nav aria-label="Legal pages" className="mt-10 flex flex-wrap gap-6 border-t border-slate-200 pt-6 font-bold text-blue-700 underline"><a href="mailto:team@sweetwater.technology">Contact Sweetwater</a><a href={kind === 'terms' ? '/privacy' : '/terms'}>{kind === 'terms' ? 'Privacy Notice' : 'Website Terms'}</a></nav>
  </main>;
}

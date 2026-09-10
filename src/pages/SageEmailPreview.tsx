import { ArrowLeft, ArrowUpRight, CheckCircle2, Mail, Phone } from 'lucide-react';
import { SweetwaterLogo } from '../components/SweetwaterLogo';

export function SageEmailPreview() {
  return (
    <div className="min-h-screen bg-[#eef3fb] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
      <header className="mx-auto mb-6 flex max-w-3xl items-center justify-between gap-4">
        <a href="/card/test" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#2e5ce6]"><ArrowLeft size={17} /> Test hub</a>
        <span className="rounded-full border border-[#cbd8f2] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#2e5ce6] shadow-sm">Email mockup</span>
      </header>

      <main className="mx-auto max-w-3xl">
        <section className="mb-4 overflow-hidden rounded-2xl border border-[#d8e1ef] bg-white text-slate-800 shadow-lg shadow-slate-300/30">
          <div className="grid gap-1 px-5 py-4 text-sm sm:grid-cols-[4rem_1fr] sm:px-7">
            <span className="text-slate-400">From</span><span className="font-semibold">Clint at Sweetwater Technology &lt;clint@sweetwater.technology&gt;</span>
            <span className="text-slate-400">Subject</span><span className="font-semibold">Jordan, here’s the workflow Sage recommended</span>
          </div>
        </section>

        <article className="mx-auto overflow-hidden rounded-2xl border border-[#d8e1ef] bg-white shadow-[0_28px_80px_rgba(63,83,120,.2)]">
          <div className="h-1.5 bg-[#2e5ce6]" />
          <header className="border-b border-[#dce5f4] bg-[#f8faff] px-6 py-7 text-slate-900 sm:px-10 sm:py-9">
            <SweetwaterLogo markClassName="h-10 w-10" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-[#2e5ce6]">Your Sage recap</p>
            <h1 className="mt-3 max-w-lg text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">Jordan, here’s what Sage pulled together.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Thanks for taking a minute to tell us what you’re working on. Based on your answers, this is the clearest place to start.</p>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <section className="rounded-2xl border border-[#d9e3fa] bg-[#f4f7ff] p-5 sm:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#2e5ce6]">What you told Sage</p>
              <p className="mt-3 text-base leading-7 text-slate-700">You’re looking for a smoother way to move home-inspection customers from the first inquiry through estimating, agreements, payment, and scheduling—with fewer manual handoffs.</p>
            </section>

            <section className="mt-8">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-slate-500">Best match</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                <div className="border-b border-[#e5ded3] bg-[#f6f3ee] px-5 py-5 text-[#252a2e] sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-black">Spect<span className="text-[#e8793d]">IQ</span></h2>
                    <span className="rounded-full border border-[#e6b092] bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-[#b64d1e]">Early access</span>
                  </div>
                  <p className="mt-4 text-lg font-bold leading-7">Priced. Signed. Paid. Booked.</p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-base leading-7 text-slate-600">SpectIQ keeps the customer, property, estimate, agreement, payment, appointment, and team’s next action connected in one deal record.</p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                    <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2e5ce6]" />Keep customer and property context together</li>
                    <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2e5ce6]" />Use company rules for explainable estimates</li>
                    <li className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2e5ce6]" />Keep people in control of consequential actions</li>
                  </ul>
                  <a href="https://spectiq.app" target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2e5ce6] px-5 py-3 text-sm font-bold text-white">Explore SpectIQ <ArrowUpRight size={17} /></a>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-[#d9e3fa] bg-[#f4f7ff] p-5 text-slate-900 sm:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#2e5ce6]">Want to talk it through?</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Reply directly to Clint.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Share the workflow that is slowing your team down, and we’ll figure out the most useful next step together.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href="mailto:clint@sweetwater.technology" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2e5ce6] px-5 py-3 text-sm font-bold text-white"><Mail size={17} /> Reply to Clint</a>
                <a href="tel:+16785211798" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#bfd0f4] bg-white px-5 py-3 text-sm font-bold text-slate-700"><Phone size={17} /> (678) 521-1798</a>
              </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-7">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-slate-500">Sweetwater Technology posts</p>
              <h2 className="mt-3 text-xl font-black tracking-tight">Keep up with what we’re building.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">If you chose to receive new posts, finish your free subscription directly with Substack.</p>
              <a href="https://sweetwatertechnology.substack.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#2e5ce6]">Visit Sweetwater Technology on Substack <ArrowUpRight size={16} /></a>
            </section>
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center sm:px-10">
            <p className="text-xs leading-5 text-slate-500">You received this email because you asked Sage to send your Sweetwater Technology recap.</p>
            <p className="mt-2 text-xs font-semibold text-slate-600">Sweetwater Technology · Atlanta, Georgia</p>
          </footer>
        </article>

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-slate-500">Sample content for design review. The final email will use each visitor’s name, conversation summary, audience, and recommended links.</p>
      </main>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, Check, Mail, Phone, ScanLine, Sparkles } from 'lucide-react';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';
import { AppCardRenderer } from '../components/AppCardRenderer';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { SageSheet } from '../components/SageSheet';
import { SEGMENTS, isSegmentId, type SegmentId } from '../data/segments';
import { PRODUCT_KNOWLEDGE } from '../data/sageKnowledge';

const PRODUCTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project])) as Record<string, AppProject>;

function SpectIQCard() {
  return (
    <a href="mailto:clint@sweetwater.technology?subject=Tell me about SpectIQ" className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-[#294374] bg-[#101a30] shadow-[0_20px_70px_rgba(2,7,18,.28)]">
      <div className="relative grid h-56 place-items-center overflow-hidden border-b border-[#294374] bg-[#0c1322]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(46,92,230,.38),transparent_58%)]" />
        <ScanLine size={82} strokeWidth={1.15} className="relative text-[#70a7ff] transition duration-500 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#09101d]/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#cdd9f8] backdrop-blur">Home inspection</span>
      </div>
      <div className="flex flex-1 flex-col p-5"><h3 className="text-2xl font-bold tracking-tight text-white">SpectIQ</h3><p className="mt-3 text-base leading-7 text-[#9cafda]">A clearer path from new inquiry to scheduled inspection, payment, and client follow-through.</p><span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#83a6ff]">Learn about SpectIQ <ArrowUpRight size={16} /></span></div>
    </a>
  );
}

function ProductSpotlight({ id, index }: { id: string; index: number }) {
  const product = PRODUCTS_BY_ID[id];
  const context = PRODUCT_KNOWLEDGE[id];

  if (id === 'spectiq') {
    return (
      <motion.article layout className="grid items-center gap-8 rounded-[2rem] border border-[#1e2c52] bg-[#0f192d]/70 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SpectIQCard />
        <ProductContext knowledge={PRODUCT_KNOWLEDGE.spectiq} action={<a href="mailto:clint@sweetwater.technology?subject=Tell me about SpectIQ" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white">Talk about SpectIQ <ArrowUpRight size={16} /></a>} />
      </motion.article>
    );
  }

  if (!product || !context) return null;

  return (
    <motion.article layout className="grid items-center gap-8 rounded-[2rem] border border-[#1e2c52] bg-[#0f192d]/70 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className={index % 2 === 1 ? 'lg:order-2' : undefined}><AppCardRenderer app={product} index={0} onClick={() => window.open(product.link, '_blank', 'noopener,noreferrer')} /></div>
      <div className={index % 2 === 1 ? 'lg:order-1' : undefined}><ProductContext knowledge={context} action={<a href={product.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white">Explore {product.title} <ArrowUpRight size={16} /></a>} /></div>
    </motion.article>
  );
}

function ProductContext({ knowledge, action }: { knowledge: typeof PRODUCT_KNOWLEDGE[string]; action: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.22em] text-[#7897ea]">{knowledge.label}</p>
      <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{knowledge.headline}</h3>
      <p className="mt-5 text-base leading-7 text-[#aebfe8]">{knowledge.summary}</p>
      {knowledge.status && <p className="mt-4 rounded-xl border border-[#2a3c68] bg-[#101a30] px-4 py-3 text-sm font-semibold text-[#c8d5f4]">{knowledge.status}</p>}
      <ul className="mt-6 space-y-3">{knowledge.outcomes.map((outcome) => <li key={outcome} className="flex gap-3 text-sm leading-6 text-[#c4d0ee]"><Check size={18} className="mt-0.5 shrink-0 text-[#6f91ec]" />{outcome}</li>)}</ul>
      <div className="mt-7 border-t border-[#25365f] pt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#7897ea]">Common questions</p><div className="space-y-2">{knowledge.faqs.map((faq) => <details key={faq.question} className="rounded-xl border border-[#26385f] bg-[#101a30] px-4 py-3"><summary className="cursor-pointer text-sm font-bold text-white">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-[#9cafda]">{faq.answer}</p></details>)}</div></div>
      <div className="mt-7">{action}</div>
    </div>
  );
}

export function CardLanding() {
  const [segment, setSegment] = useState<SegmentId>(() => {
    if (typeof window === 'undefined') return 'custom';
    const requested = new URLSearchParams(window.location.search).get('segment');
    return isSegmentId(requested) ? requested : 'custom';
  });
  const [openSignal, setOpenSignal] = useState(0);
  const active = SEGMENTS[segment];
  const order = useMemo(() => active.portfolioOrder, [active]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('test') === '1') return;
    void fetch('https://n8n.sproutify.app/webhook/card-scan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch: new URLSearchParams(window.location.search).get('b'), ts: Date.now(), referrer: document.referrer, ua: navigator.userAgent }),
    }).catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0c1322] text-white selection:bg-[#2e5ce6] selection:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_5%,rgba(46,92,230,.18),transparent_30%),radial-gradient(circle_at_88%_35%,rgba(74,102,170,.12),transparent_28%)]" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8"><a href="/" aria-label="Sweetwater Technology home" className="shrink-0"><SweetwaterLogo reversed markClassName="h-9 w-9" className="[&>span:last-child]:hidden min-[360px]:[&>span:last-child]:flex" /></a><a href="/" className="inline-flex min-h-11 shrink-0 items-center text-xs font-bold text-[#aebfe8] transition hover:text-white">Visit full site <ArrowUpRight className="ml-1" size={14} /></a></header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
          <motion.div key={segment} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#7897ea]"><Sparkles size={14} /> Built around your business</p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[5.7rem]">{active.heroHeadline}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#aebfe8] sm:text-xl">{active.heroSub}</p>
          </motion.div>
          <div className="mt-10 flex flex-wrap gap-3"><button onClick={() => setOpenSignal((value) => value + 1)} className="rounded-full bg-[#2e5ce6] px-6 py-3 text-sm font-bold shadow-xl shadow-blue-950/30 transition hover:bg-[#3c69e9]">Tell Sage what you need</button><a href="#work" className="rounded-full border border-[#2a3c68] px-6 py-3 text-sm font-bold text-[#c7d4f5] transition hover:border-[#526a9d]">See the work</a></div>
        </section>

        <section id="work" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#6f91ec]">Selected work</p><h2 className="mt-3 text-3xl font-bold tracking-tight">A product, and the problem it solves</h2></div><p className="hidden max-w-xs text-right text-sm leading-6 text-[#8499c7] sm:block">The same product cards from our full portfolio, with the story behind each one.</p></div>
          <motion.div layout className="space-y-6">{order.map((id, index) => <ProductSpotlight key={id} id={id} index={index} />)}</motion.div>
        </section>

        <section className="border-y border-[#1e2c52] bg-[#101a30]/70"><div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-5 py-6 text-center text-sm font-semibold text-[#b7c5e6]"><Check size={18} className="text-[#6f91ec]" /> Built and shipped from Atlanta. Live products, real customers.</div></section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"><div className="relative overflow-hidden rounded-[2rem] border border-[#2a3c68] bg-[#101a30] p-7 sm:p-12"><div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#2e5ce6]/20 blur-3xl" /><p className="text-xs font-bold uppercase tracking-[.22em] text-[#7897ea]">Custom apps and automation</p><h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Have a workflow that should feel easier?</h2><p className="mt-5 max-w-2xl leading-7 text-[#9cafda]">We turn operational friction, ambitious product ideas, and repetitive work into software your team can rely on.</p><div className="relative mt-8 flex flex-wrap gap-3"><a href="mailto:clint@sweetwater.technology" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0c1322]"><Mail size={17} /> Talk to Clint</a><a href="tel:+16785211798" className="inline-flex items-center gap-2 rounded-full border border-[#3b4f7c] px-5 py-3 text-sm font-bold text-white"><Phone size={17} /> +1 (678) 521-1798</a><button onClick={() => setOpenSignal((value) => value + 1)} className="inline-flex items-center gap-2 rounded-full border border-[#3b4f7c] px-5 py-3 text-sm font-bold text-white"><Bot size={17} /> Ask Sage</button></div></div></section>
      </main>

      <footer className="relative z-10 border-t border-[#1e2c52] px-5 py-8 text-center text-xs text-[#6578a3]">© {new Date().getFullYear()} Sweetwater Technology. Atlanta, Georgia.</footer>
      <SageSheet segment={segment} setSegment={setSegment} openSignal={openSignal} />
    </div>
  );
}
